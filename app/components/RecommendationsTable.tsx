// app/components/RecommendationsTable.tsx

import React, {useEffect, useMemo, useState} from "react";
import Image from "next/image";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import {Button} from "./ui/button";
import {TrackPlayer} from "./TrackPlayer";
import {addTrackToPlaylist, removeTrackFromPlaylist} from "../lib/trackUtils";
import {RecommendationsTableProps} from '../types/recommendationsTableProps';
import {useMutation} from '@tanstack/react-query';
import LoadingSpinner from './LoadingSpinner';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "./ui/table";
import {ArrowUpDown} from "lucide-react";

/**
 * おすすめ楽曲のテーブルコンポーネント
 * @param {RecommendationsTableProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} - おすすめ楽曲のテーブル
 */
export const RecommendationsTable: React.FC<RecommendationsTableProps> = ({
                                                                              tracks,
                                                                              ownerId,
                                                                              userId,
                                                                              playlistId,
                                                                          }) => {
    // プレイリストのIDを保持する状態変数
    const [createdPlaylistId, setCreatedPlaylistId] = useState<string | null>(null);
    // テーブルのソート状態を保持する状態変数
    const [sorting, setSorting] = useState<SortingState>([]);
    
    // ownerIdとuserIdの変更を監視し、コンソールに出力する
    useEffect(() => {
        console.log("ownerId:", ownerId);
        console.log("userId:", userId);
    }, [ownerId, userId]);
    
    // プレイリスト作成のためのMutationを定義
    const createPlaylistMutation = useMutation({
        mutationFn: async (trackIds: string[]) => {
            const response = await fetch('/api/playlists/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trackIds),
                credentials: 'include',
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`プレイリストの作成中にエラーが発生しました: ${errorData.details}`);
            }
            
            const data = await response.json();
            return data.playlistId;
        },
        onSuccess: (data: string) => {
            setCreatedPlaylistId(data);
        },
        onError: (error) => {
            console.error("プレイリストの作成中にエラーが発生しました。", error);
        },
    });
    
    // プレイリストを作成する関数
    const createPlaylist = () => {
        const trackIds = tracks.map(track => track.id as string);
        createPlaylistMutation.mutate(trackIds);
    };
    
    // テーブルのカラム定義をメモ化
    const columns = useMemo<ColumnDef<typeof tracks[0]>[]>(() => {
        const baseColumns: ColumnDef<typeof tracks[0]>[] = [
            {
                header: 'Album',
                cell: info => (
                    <Image
                        src={info.row.original.album.images[0].url}
                        alt={info.row.original.album.name}
                        width={50}
                        height={50}
                        className="object-cover rounded-full"
                    />
                ),
            },
            {
                header: 'Title',
                accessorKey: 'name',
            },
            {
                header: 'Artist',
                cell: info => info.row.original.artists[0].name,
            },
            {
                header: 'Preview',
                cell: info => <TrackPlayer track={info.row.original}/>,
            },
        ];
        
        // オーナーがユーザーと同じ場合にアクションカラムを追加
        if (ownerId === userId) {
            baseColumns.push({
                header: 'Actions',
                cell: info => ownerId === userId && (
                    <>
                        <Button onClick={() => addTrackToPlaylist(playlistId, info.row.original.id as string)}>
                            追加
                        </Button>
                        <Button onClick={() => removeTrackFromPlaylist(playlistId, info.row.original.id as string)}>
                            削除
                        </Button>
                    </>
                ),
            });
        }
        
        return baseColumns;
    }, [ownerId, userId, playlistId]);
    
    // テーブルの設定を定義
    const table = useReactTable({
        data: tracks,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });
    
    return (
        <div className="flex flex-col">
            <div className="w-full overflow-x-auto">
                <LoadingSpinner loading={createPlaylistMutation.isPending}/>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header, index) => (
                                    <TableHead key={header.id} onClick={header.column.getToggleSortingHandler()}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {index !== 0 && <ArrowUpDown className="ml-2 h-4 w-4"/>}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} data-testid={cell.column.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {userId && (
                <div className="mt-4">
                    <Button onClick={createPlaylist}>おすすめ楽曲をもとにプレイリストを作成する</Button>
                    {createdPlaylistId && (
                        <Button className="ml-4"
                                onClick={() => window.open(`https://open.spotify.com/playlist/${createdPlaylistId}`, '_blank')}>
                            作成したプレイリストを表示
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};
