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
import {useToast} from "@/app/components/ui/use-toast";

export const RecommendationsTable: React.FC<RecommendationsTableProps> = ({
                                                                              tracks,
                                                                              ownerId,
                                                                              userId,
                                                                              playlistId,
                                                                          }) => {
    const [createdPlaylistId, setCreatedPlaylistId] = useState<string | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [addedTracks, setAddedTracks] = useState<Set<string>>(new Set());
    const {toast} = useToast();
    
    useEffect(() => {
        console.log("ownerId:", ownerId);
        console.log("userId:", userId);
    }, [ownerId, userId]);
    
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
            toast({
                title: "プレイリスト作成成功",
                description: "新しいプレイリストが正常に作成されました。",
            });
        },
        onError: (error) => {
            console.error("プレイリストの作成中にエラーが発生しました。", error);
            toast({
                title: "エラー",
                description: "プレイリストの作成中にエラーが発生しました。",
                variant: "destructive",
            });
        },
    });
    
    const createPlaylist = () => {
        const trackIds = tracks.map(track => track.id as string);
        createPlaylistMutation.mutate(trackIds);
    };
    
    const handleAddTrack = async (playlistId: string, trackId: string) => {
        try {
            await addTrackToPlaylist(playlistId, trackId);
            setAddedTracks(prev => new Set(prev).add(trackId));
            toast({
                title: "楽曲追加",
                description: "プレイリストに楽曲を追加しました。",
            });
        } catch (error) {
            console.error("楽曲の追加中にエラーが発生しました。", error);
            toast({
                title: "エラー",
                description: "楽曲の追加中にエラーが発生しました。",
                variant: "destructive",
            });
        }
    };
    
    const handleRemoveTrack = async (playlistId: string, trackId: string) => {
        try {
            await removeTrackFromPlaylist(playlistId, trackId);
            setAddedTracks(prev => {
                const newSet = new Set(prev);
                newSet.delete(trackId);
                return newSet;
            });
            toast({
                title: "楽曲削除",
                description: "プレイリストから楽曲を削除しました。",
            });
        } catch (error) {
            console.error("楽曲の削除中にエラーが発生しました。", error);
            toast({
                title: "エラー",
                description: "楽曲の削除中にエラーが発生しました。",
                variant: "destructive",
            });
        }
    };
    
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
        
        if (ownerId === userId) {
            baseColumns.push({
                header: 'Actions',
                cell: info => {
                    const trackId = info.row.original.id as string;
                    return ownerId === userId && (
                        addedTracks.has(trackId) ? (
                            <Button onClick={() => handleRemoveTrack(playlistId, trackId)}>
                                削除
                            </Button>
                        ) : (
                            <Button onClick={() => handleAddTrack(playlistId, trackId)}>
                                追加
                            </Button>
                        )
                    );
                },
            });
        }
        
        return baseColumns;
    }, [ownerId, userId, playlistId, addedTracks]);
    
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
