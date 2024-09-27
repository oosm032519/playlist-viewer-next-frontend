// app/components/FavoritePlaylistsTable.tsx

"use client";

import React, {useContext, useMemo} from 'react';
import {useQuery} from '@tanstack/react-query';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table';
import {format} from 'date-fns';
import {usePlaylist} from '@/app/context/PlaylistContext';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import {FavoriteContext} from '@/app/context/FavoriteContext';
import DOMPurify from 'dompurify';
import {useUser} from '@/app/context/UserContext';
import {handleApiError} from "@/app/lib/api-utils";

/**
 * お気に入りプレイリストの型定義
 */
interface FavoritePlaylist {
    playlistId: string;
    playlistName: string;
    playlistOwnerName: string;
    totalTracks: number;
    addedAt: string;
}

/**
 * お気に入りプレイリストをAPIから取得する非同期関数
 * @returns {Promise<FavoritePlaylist[]>} お気に入りプレイリストの配列
 * @throws APIリクエストが失敗した場合にエラーをスロー
 */
const fetchFavoritePlaylists = async (): Promise<FavoritePlaylist[]> => {
    const response = await fetch('/api/playlists/favorites', {
        method: 'GET',
        credentials: 'include',
    });
    
    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }
    
    return response.json();
};

/**
 * FavoritePlaylistsTableコンポーネント
 * お気に入りプレイリストをテーブル形式で表示する
 */
const FavoritePlaylistsTable: React.FC = () => {
    const {setSelectedPlaylistId} = usePlaylist();
    const {favorites, addFavorite, removeFavorite} = useContext(FavoriteContext);
    const {isLoggedIn} = useUser();
    const {data: playlists, isLoading, error, refetch} = useQuery<FavoritePlaylist[], Error>({
        queryKey: ['favoritePlaylists'],
        queryFn: fetchFavoritePlaylists,
        enabled: isLoggedIn, // isLoggedInがtrueの場合のみクエリを実行
    });
    
    const [sorting, setSorting] = React.useState<SortingState>([]);
    
    /**
     * お気に入りの星アイコンをクリックしたときのハンドラー
     * @param {FavoritePlaylist} playlist 対象のプレイリスト
     * @param {boolean} isFavorite 現在のお気に入り状態
     * @param {React.MouseEvent} event クリックイベント
     */
    const handleStarClick = async (playlist: FavoritePlaylist, isFavorite: boolean, event: React.MouseEvent) => {
        event.stopPropagation();
        
        try {
            const response = await fetch('/api/playlists/favorite', {
                method: isFavorite ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    playlistId: playlist.playlistId,
                    playlistName: playlist.playlistName,
                    totalTracks: playlist.totalTracks,
                    playlistOwnerName: playlist.playlistOwnerName
                }),
                credentials: 'include',
            });
            
            if (!response.ok) {
                return handleApiError(new Error(`お気に入りプレイリストの${isFavorite ? '削除' : '追加'}に失敗しました: ${response.status}`));
            }
            
            if (isFavorite) {
                removeFavorite(playlist.playlistId);
            } else {
                addFavorite(playlist.playlistId, playlist.playlistName, playlist.totalTracks);
            }
            refetch();
        } catch (error) {
            return handleApiError(error);
        }
    };
    
    /**
     * テーブルのカラム定義
     */
    const columns: ColumnDef<FavoritePlaylist>[] = useMemo(
        () => [
            {
                accessorKey: 'playlistName',
                header: 'プレイリスト名',
                cell: ({getValue}) => {
                    const value = getValue() as string;
                    return <span>{DOMPurify.sanitize(value)}</span>;
                },
            },
            {
                accessorKey: 'playlistOwnerName',
                header: '作成者',
                cell: ({getValue}) => {
                    const value = getValue() as string;
                    return <span>{DOMPurify.sanitize(value)}</span>;
                },
            },
            {
                accessorKey: 'totalTracks',
                header: '楽曲数',
                cell: ({getValue}) => {
                    const value = getValue() as number;
                    return <span>{value}</span>;
                },
            },
            {
                accessorKey: 'addedAt',
                header: 'お気に入り追加日時',
                cell: ({getValue}) => {
                    const value = getValue() as string;
                    return <span>{format(new Date(value), 'yyyy/MM/dd HH:mm')}</span>;
                },
            },
            {
                id: 'favorite',
                header: 'お気に入り',
                cell: ({row}) => {
                    const playlist = row.original;
                    const isFavorite = playlist.playlistId in favorites;
                    return (
                        <button onClick={(event) => handleStarClick(playlist, isFavorite, event)}>
                            {isFavorite ? (
                                <span className="text-yellow-400 text-2xl">★</span>
                            ) : (
                                <span className="text-gray-400 text-2xl">☆</span>
                            )}
                        </button>
                    );
                },
            },
        ],
        [favorites, handleStarClick]
    );
    
    /**
     * React Tableのインスタンスを作成
     */
    const table = useReactTable({
        data: playlists || [],
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });
    
    if (isLoading) {
        return <div>Loading...</div>;
    }
    
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    
    return (
        <>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} onClick={header.column.getToggleSortingHandler()}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {{
                                        asc: ' ▲',
                                        desc: ' ▼',
                                    }[header.column.getIsSorted() as string] ?? null}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            onClick={() => setSelectedPlaylistId(row.original.playlistId)}
                            style={{cursor: "pointer"}}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};

export default FavoritePlaylistsTable;
