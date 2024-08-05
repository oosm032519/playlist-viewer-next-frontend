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
import {RecommendationsTableProps} from '../types/recommendationsTableProps';
import {useToast} from "@/app/components/ui/use-toast";
import {useTrackActions} from "../hooks/useTrackActions";
import {useCreatePlaylistMutation} from "../hooks/useCreatePlaylistMutation";
import LoadingSpinner from './LoadingSpinner';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "./ui/table";
import {ArrowUpDown} from "lucide-react";
import DOMPurify from 'dompurify';

// DOMPurify の設定
const purifyConfig = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href', 'target']
};

export const RecommendationsTable: React.FC<RecommendationsTableProps> = ({tracks, ownerId, userId, playlistId}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const {toast} = useToast();
    const {createPlaylist, createdPlaylistId, isCreating} = useCreatePlaylistMutation(tracks, toast);
    const {addedTracks, handleAddTrack, handleRemoveTrack} = useTrackActions(playlistId, toast);
    
    useEffect(() => {
        console.log("ownerId:", ownerId);
        console.log("userId:", userId);
    }, [ownerId, userId]);
    
    // DOMPurify の結果をメモ化
    const sanitize = useMemo(() => (content: string) => DOMPurify.sanitize(content, purifyConfig), []);
    
    const columns = useMemo<ColumnDef<typeof tracks[0]>[]>(() => {
        const baseColumns: ColumnDef<typeof tracks[0]>[] = [
            {
                header: 'Album',
                cell: info => (
                    <Image
                        src={sanitize(info.row.original.album.images[0].url)}
                        alt={sanitize(info.row.original.album.name)}
                        width={50}
                        height={50}
                    />
                ),
            },
            {
                header: 'Title',
                accessorKey: 'name',
                cell: info => <span dangerouslySetInnerHTML={{__html: sanitize(info.getValue() as string)}}/>,
            },
            {
                header: 'Artist',
                cell: info => <span dangerouslySetInnerHTML={{__html: sanitize(info.row.original.artists[0].name)}}/>,
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
                            <Button onClick={() => handleRemoveTrack(trackId)}>
                                削除
                            </Button>
                        ) : (
                            <Button onClick={() => handleAddTrack(trackId)}>
                                追加
                            </Button>
                        )
                    );
                },
            });
        }
        
        return baseColumns;
    }, [ownerId, userId, addedTracks, handleAddTrack, handleRemoveTrack, sanitize]);
    
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
                <LoadingSpinner loading={isCreating}/>
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
