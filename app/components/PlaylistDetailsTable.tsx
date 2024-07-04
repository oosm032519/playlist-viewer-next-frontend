// app/components/PlaylistDetailsTable.tsx

"use client";

import React, {useMemo, useState} from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
    SortingState,
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
import Image from "next/image";
import AudioFeaturesChart from "./AudioFeaturesChart";
import {audioFeatureSort} from "../lib/tableUtils";

interface PlaylistDetailsTableProps {
    tracks: Track[];
}

type AudioFeature =
    | 'danceability'
    | 'energy'
    | 'key'
    | 'loudness'
    | 'speechiness'
    | 'acousticness'
    | 'instrumentalness'
    | 'liveness'
    | 'valence'
    | 'tempo';

const columnHelper = createColumnHelper<Track>();

export const PlaylistDetailsTable: React.FC<PlaylistDetailsTableProps> = ({tracks}) => {
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    
    const columns = useMemo(() => [
        columnHelper.accessor("album", {
            header: "Album",
            cell: (info) => (
                <Image src={info.getValue().images[0].url} alt={info.getValue().name} width={50} height={50}/>
            ),
            enableSorting: false,
        }),
        columnHelper.accessor("name", {
            header: "Title",
        }),
        columnHelper.accessor("artists", {
            header: "Artist",
            cell: (info) => <span>{info.getValue()[0].name}</span>,
        }),
        ...(["danceability", "energy", "key", "loudness", "speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo"] as AudioFeature[]).map((feature) =>
            columnHelper.accessor((row) => row.audioFeatures?.[feature], {
                id: feature,
                header: feature.charAt(0).toUpperCase() + feature.slice(1),
                sortingFn: (a, b) => audioFeatureSort(a, b, feature),
                cell: (info) => info.getValue()?.toFixed(3) ?? "-",
            })
        ),
        columnHelper.accessor((row) => row.audioFeatures?.mode, {
            id: "mode",
            header: "Mode",
            sortingFn: (a, b) => {
                const modeA = a.original.audioFeatures?.mode ?? "";
                const modeB = b.original.audioFeatures?.mode ?? "";
                return modeA.localeCompare(modeB);
            },
            cell: (info) => info.getValue() ?? "-",
        }),
        columnHelper.accessor("durationMs", {
            header: "Duration (ms)",
            sortingFn: (a, b) => (a.original.durationMs || 0) - (b.original.durationMs || 0),
            cell: (info) => info.getValue()?.toString() ?? "-",
        }),
        columnHelper.accessor((row) => row.audioFeatures?.timeSignature, {
            id: "timeSignature",
            header: "Time Signature",
            sortingFn: (a, b) => audioFeatureSort(a, b, 'timeSignature'),
            cell: (info) => info.getValue()?.toString() ?? "-",
        }),
    ], []);
    
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
