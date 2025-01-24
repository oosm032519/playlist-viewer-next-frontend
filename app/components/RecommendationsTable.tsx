// app/components/RecommendationsTable.tsx

import React, {useMemo, useState} from "react";
import Image from "next/image";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import {Button} from "@/app/components/ui/button";
import {TrackPlayer} from "@/app/components/TrackPlayer";
import {RecommendationsTableProps} from '@/app/types/recommendationsTableProps';
import {useToast} from "@/app/components/ui/use-toast";
import {useTrackActions} from "@/app/hooks/useTrackActions";
import {useCreatePlaylistMutation} from "@/app/hooks/useCreatePlaylistMutation";
import LoadingSpinner from '@/app/components/LoadingSpinner';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/app/components/ui/table";
import {ArrowUpDown} from "lucide-react";
import DOMPurify from 'dompurify';
import {Tooltip, TooltipTrigger, TooltipContent} from "@/app/components/ui/tooltip";

const purifyConfig = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href', 'target']
};

/**
 * 推奨トラックを表示するテーブルコンポーネント
 * @param {RecommendationsTableProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} 推奨トラックのテーブルをレンダリングするReactコンポーネント
 */
export const RecommendationsTable: React.FC<RecommendationsTableProps> = ({tracks, ownerId, userId, playlistId}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const {toast} = useToast();
    const {createPlaylist, isCreating} = useCreatePlaylistMutation(toast);
    const {addedTracks, handleAddTrack, handleRemoveTrack} = useTrackActions(playlistId, toast);
    
    const sanitize = useMemo(() => (content: string) => DOMPurify.sanitize(content, purifyConfig), []);
    
    const columns = useMemo<ColumnDef<typeof tracks[0]>[]>(() => {
        const baseColumns: ColumnDef<typeof tracks[0]>[] = [
            {
                header: 'Album',
                cell: info => {
                    const album = info.row.original.album;
                    const albumName = album.name;
                    const albumImageUrl = album.images[0].url;
                    const albumUrl = album.externalUrls.externalUrls.spotify;
                    
                    return (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <a href={albumUrl} target="_blank" rel="noopener noreferrer">
                                    <div className="w-12 h-12 relative">
                                        <Image
                                            src={sanitize(albumImageUrl)}
                                            alt={sanitize(albumName)}
                                            className="object-contain w-full h-full"
                                            width={60}
                                            height={60}
                                        />
                                    </div>
                                </a>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="pointer-events-none">
                                <p>{sanitize(albumName)}</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                },
            },
            {
                header: 'Title',
                accessorKey: 'name',
                cell: info => {
                    const trackUrl = info.row.original.externalUrls.externalUrls.spotify;
                    return <a href={trackUrl} target="_blank" rel="noopener noreferrer">
                        <span dangerouslySetInnerHTML={{__html: sanitize(info.getValue() as string)}}/>
                    </a>
                },
            },
            {
                header: 'Artist',
                cell: info => {
                    const artistUrl = info.row.original.artists[0].externalUrls.externalUrls.spotify;
                    return <a href={artistUrl} target="_blank" rel="noopener noreferrer">
                        <span dangerouslySetInnerHTML={{__html: sanitize(info.row.original.artists[0].name)}}/>
                    </a>
                }
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
    
    const createPlaylistHandler = () => {
        const trackIds = tracks.map(track => track.id as string);
        createPlaylist(trackIds);
    };
    
    const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';
    
    
    return (
        <div className="flex flex-col">
            <LoadingSpinner loading={isCreating}/> {/* isCreating を直接使う */}
            <div className="w-full overflow-x-auto">
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
            {userId && !isMockMode && (
                <div className="mt-4">
                    <Button onClick={createPlaylistHandler} disabled={isCreating}>
                        おすすめ楽曲をもとにプレイリストを作成する
                    </Button>
                </div>
            )}
        </div>
    );
};
