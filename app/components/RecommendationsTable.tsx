// app/components/RecommendationsTable.tsx

import React, {useEffect, useState, useMemo} from "react";
import Image from "next/image";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    ColumnDef,
    flexRender,
    SortingState
} from "@tanstack/react-table";
import {Button} from "./ui/button";
import {TrackPlayer} from "./TrackPlayer";
import {addTrackToPlaylist, removeTrackFromPlaylist} from "../lib/utils";
import {RecommendationsTableProps} from '../types/recommendationsTableProps';
import axios from 'axios';
import {useMutation} from '@tanstack/react-query';
import LoadingSpinner from './LoadingSpinner';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "./ui/table";
import {ArrowUpDown} from "lucide-react";

export const RecommendationsTable: React.FC<RecommendationsTableProps> = ({
                                                                              tracks,
                                                                              ownerId,
                                                                              userId,
                                                                              playlistId,
                                                                          }) => {
    const [createdPlaylistId, setCreatedPlaylistId] = useState<string | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    
    useEffect(() => {
        console.log("ownerId:", ownerId);
        console.log("userId:", userId);
    }, [ownerId, userId]);
    
    const createPlaylistMutation = useMutation({
        mutationFn: async (trackIds: string[]) => {
            const response = await axios.post('/api/playlists/create', trackIds);
            return response.data;
        },
        onSuccess: (data: string) => {
            setCreatedPlaylistId(data);
        },
        onError: (error) => {
            console.error("プレイリストの作成中にエラーが発生しました。", error);
        },
    });
    
    const createPlaylist = () => {
        const trackIds = tracks.map(track => track.id as string);
        createPlaylistMutation.mutate(trackIds);
    };
    
    const columns = useMemo<ColumnDef<typeof tracks[0]>[]>(() => [
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
        {
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
        },
    ], [ownerId, userId, playlistId]);
    
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
            <div className="mt-4">
                <Button onClick={createPlaylist}>おすすめ楽曲をもとにプレイリストを作成する</Button>
                {createdPlaylistId && (
                    <Button className="ml-4"
                            onClick={() => window.open(`https://open.spotify.com/playlist/${createdPlaylistId}`, '_blank')}>
                        作成したプレイリストを表示
                    </Button>
                )}
            </div>
        </div>
    );
};
