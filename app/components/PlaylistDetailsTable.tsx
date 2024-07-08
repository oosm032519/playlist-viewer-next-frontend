"use client";

import React, {useState} from "react";
import {useReactTable, getCoreRowModel, getSortedRowModel, flexRender, SortingState} from "@tanstack/react-table";
import {Track} from "../types/track";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "./ui/table";
import {ArrowUpDown} from "lucide-react";
import AudioFeaturesChart from "./AudioFeaturesChart";
import {playlistDetailsTableColumns} from "../lib/PlaylistDetailsTableColumns";

interface PlaylistDetailsTableProps {
    tracks: Track[];
}

export const PlaylistDetailsTable: React.FC<PlaylistDetailsTableProps> = ({tracks}) => {
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    
    const table = useReactTable({
        data: tracks,
        columns: playlistDetailsTableColumns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });
    
    const handleRowClick = (row: Track) => setSelectedTrack(row);
    
    if (tracks.length === 0) {
        return (
            <div className="text-center text-gray-500 my-4">
                このプレイリストには曲が含まれていません
            </div>
        );
    }
    
    return (
        <div className="flex flex-col">
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
                            <TableRow
                                key={row.id}
                                onClick={() => handleRowClick(row.original)}
                                style={{cursor: "pointer"}}
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
            {selectedTrack && (
                <div className="mt-8 w-full max-w-2xl mx-auto">
                    <h3 className="text-lg font-semibold mb-4">Audio Features: {selectedTrack.name}</h3>
                    <AudioFeaturesChart track={selectedTrack}/>
                </div>
            )}
        </div>
    );
};
