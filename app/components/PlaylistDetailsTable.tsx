// PlaylistDetailsTable.tsx
"use client";

import React, {useState} from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    SortingState,
    ColumnDef,
} from "@tanstack/react-table";
import {Track} from "@/app/types/track";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/components/ui/table";
import {ArrowUpDown} from "lucide-react";
import {playlistDetailsTableColumns} from "@/app/lib/PlaylistDetailsTableColumns";
import {AudioFeatures} from "@/app/types/audioFeatures";
import {Button} from "@/app/components/ui/button";
import {useCreatePlaylistMutation} from "@/app/hooks/useCreatePlaylistMutation";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import {useToast} from "@/app/components/ui/use-toast";

/**
 * プレイリストの詳細テーブルを表示するためのプロパティ
 */
interface PlaylistDetailsTableProps {
    tracks: Track[];
    averageAudioFeatures: AudioFeatures;
    selectedTrackId: string | null; // 選択されたトラックのID
    onTrackSelect: (trackId: string | null) => void; // トラックIDを渡す形に変更
    playlistName: string | null;
}

/**
 * プレイリストの詳細テーブルを表示するコンポーネント
 * @param {PlaylistDetailsTableProps} props - トラックの配列と平均オーディオフィーチャーを含むプロパティ
 * @returns {JSX.Element} プレイリストの詳細テーブル
 */
export const PlaylistDetailsTable: React.FC<PlaylistDetailsTableProps> = ({
                                                                              tracks,
                                                                              averageAudioFeatures,
                                                                              selectedTrackId,
                                                                              onTrackSelect,
                                                                              playlistName,
                                                                          }) => {
    const {toast} = useToast();
    const [sorting, setSorting] = useState<SortingState>([]);
    
    const {createPlaylist, isCreating} = useCreatePlaylistMutation(toast);
    
    // React Tableの設定
    const table = useReactTable({
        data: tracks,
        columns: playlistDetailsTableColumns as ColumnDef<Track>[],
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });
    
    const handleCreateSortedPlaylist = async () => {
        const sortedTrackIds = table.getRowModel().rows.map((row) => row.original.id);
        const newPlaylistName = playlistName ? `${playlistName}.sorted` : undefined;
        createPlaylist(sortedTrackIds, newPlaylistName);
    };
    
    const handleRowClick = (row: Track) => onTrackSelect(row.id); // トラックIDを渡す
    
    if (tracks.length === 0) {
        return (
            <div className="text-center text-gray-500 my-4">
                このプレイリストには曲が含まれていません
            </div>
        );
    }
    
    return (
        <div className="flex flex-col">
            <LoadingSpinner loading={isCreating}/>
            
            <Button onClick={handleCreateSortedPlaylist} disabled={isCreating}>
                ソート順で新しいプレイリストを作成
            </Button>
            
            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header, index) => (
                                    <TableHead
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {index !== 0 && <ArrowUpDown className="ml-2 h-4 w-4"/>}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                onClick={() => handleRowClick(row.original)}
                                style={{
                                    cursor: "pointer",
                                    backgroundColor:
                                        row.original.id === selectedTrackId ? "#f0f0f0" : "transparent",
                                }}
                            >
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
        </div>
    );
};
