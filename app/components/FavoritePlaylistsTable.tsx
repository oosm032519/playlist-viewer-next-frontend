"use client";

import React, {useContext} from 'react';
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

interface FavoritePlaylist {
    playlistId: string;
    playlistName: string;
    playlistOwnerName: string;
    totalTracks: number;
    addedAt: string;
}

const fetchFavoritePlaylists = async (): Promise<FavoritePlaylist[]> => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'; // 環境変数を使用
    // セッションストレージからJWTを取得
    const jwt = sessionStorage.getItem('JWT');
    const response = await fetch(`${backendUrl}/api/playlists/favorites`, { // バックエンドURLを付加
        headers: {
            'Authorization': `Bearer ${jwt}`, // JWTをAuthorizationヘッダーに設定
        },
    });
    
    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }
    
    return response.json();
};

const FavoritePlaylistsTable: React.FC = () => {
    const {setSelectedPlaylistId} = usePlaylist();
    const {favorites, addFavorite, removeFavorite} = useContext(FavoriteContext);
    const {data: playlists, isLoading, error} = useQuery<FavoritePlaylist[], Error>({
        queryKey: ['favoritePlaylists'],
        queryFn: fetchFavoritePlaylists,
    });
    
    const [sorting, setSorting] = React.useState<SortingState>([]);
    
    const handleStarClick = async (playlist: FavoritePlaylist, isFavorite: boolean, event: React.MouseEvent) => {
        event.stopPropagation();
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'; // 環境変数を使用
        // セッションストレージからJWTを取得
        const jwt = sessionStorage.getItem('JWT');
        try {
            const response = await fetch(
                `${backendUrl}/api/playlists/favorite?playlistId=${playlist.playlistId}&playlistName=${encodeURIComponent(
                    playlist.playlistName
                )}&totalTracks=${playlist.totalTracks}&playlistOwnerName=${encodeURIComponent(playlist.playlistOwnerName)}`, // バックエンドURLを付加
                {
                    method: isFavorite ? 'DELETE' : 'POST',
                    headers: {
                        'Authorization': `Bearer ${jwt}`, // JWTをAuthorizationヘッダーに設定
                    },
                }
            );
            
            if (response.ok) {
                if (isFavorite) {
                    removeFavorite(playlist.playlistId);
                } else {
                    addFavorite(playlist.playlistId, playlist.playlistName, playlist.totalTracks);
                }
            } else {
                console.error('お気に入り登録/解除に失敗しました。');
            }
        } catch (error) {
            console.error('お気に入り登録/解除中にエラーが発生しました。', error);
        }
    };
    
    const columns: ColumnDef<FavoritePlaylist>[] = React.useMemo(
        () => [
            {
                accessorKey: 'playlistName',
                header: 'プレイリスト名',
            },
            {
                accessorKey: 'playlistOwnerName',
                header: '作成者',
            },
            {
                accessorKey: 'totalTracks',
                header: '楽曲数',
            },
            {
                accessorKey: 'addedAt',
                header: 'お気に入り追加日時',
                cell: ({getValue}) => format(new Date(getValue() as string), 'yyyy/MM/dd HH:mm'),
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
            <h2 className="text-2xl font-bold mb-4">お気に入り</h2>
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
