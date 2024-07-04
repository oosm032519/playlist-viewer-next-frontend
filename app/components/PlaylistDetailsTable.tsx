"use client";

import React, {useMemo, useState} from "react";
import {useTable, useSortBy, Column, Row} from "react-table";
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
    'danceability'
    | 'energy'
    | 'key'
    | 'loudness'
    | 'speechiness'
    | 'acousticness'
    | 'instrumentalness'
    | 'liveness'
    | 'valence'
    | 'tempo';

export const PlaylistDetailsTable: React.FC<PlaylistDetailsTableProps> = ({tracks}) => {
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
    
    const columns = useMemo<Column<Track>[]>(() => [
        {
            Header: "Album",
            accessor: "album",
            Cell: ({value}: { value: Track['album'] }) => (
                <Image src={value.images[0].url} alt={value.name} width={50} height={50}/>
            ),
            disableSortBy: true,
        },
        {Header: "Title", accessor: "name"},
        {
            Header: "Artist",
            accessor: "artists",
            Cell: ({value}: { value: Track['artists'] }) => <span>{value[0].name}</span>,
        },
        ...(["danceability", "energy", "key", "loudness", "speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo"] as AudioFeature[]).map(feature => ({
            Header: feature.charAt(0).toUpperCase() + feature.slice(1),
            accessor: (row: Track) => row.audioFeatures?.[feature],
            sortType: (a: Row<Track>, b: Row<Track>) => audioFeatureSort(a, b, feature),
            Cell: ({value}: { value: number | undefined }) => value?.toFixed(3) ?? "-",
        })),
        {
            Header: "Mode",
            accessor: (row: Track) => row.audioFeatures?.mode,
            sortType: (a: Row<Track>, b: Row<Track>) => {
                const modeA = a.original.audioFeatures?.mode ?? "";
                const modeB = b.original.audioFeatures?.mode ?? "";
                return modeA.localeCompare(modeB);
            },
            Cell: ({value}: { value: string | undefined }) => value ?? "-",
        },
        {
            Header: "Duration (ms)",
            accessor: "durationMs",
            sortType: (a: Row<Track>, b: Row<Track>) => (a.original.durationMs || 0) - (b.original.durationMs || 0),
            Cell: ({value}: { value: number | undefined }) => value?.toString() ?? "-",
        },
        {
            Header: "Time Signature",
            accessor: (row: Track) => row.audioFeatures?.timeSignature,
            sortType: (a: Row<Track>, b: Row<Track>) => audioFeatureSort(a, b, 'timeSignature'),
            Cell: ({value}: { value: number | undefined }) => value?.toString() ?? "-",
        },
    ], []);
    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({columns, data: tracks}, useSortBy);
    
    const handleRowClick = (row: Row<Track>) => setSelectedTrack(row.original);
    
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
                <Table {...getTableProps()}>
                    <TableHeader>
                        {headerGroups.map(headerGroup => {
                            const {key, ...headerGroupProps} = headerGroup.getHeaderGroupProps();
                            return (
                                <TableRow key={key} {...headerGroupProps}>
                                    {headerGroup.headers.map((column, index) => {
                                        const {
                                            key,
                                            ...columnProps
                                        } = column.getHeaderProps((column as any).getSortByToggleProps());
                                        return (
                                            <TableHead key={key} {...columnProps}>
                                                {column.render("Header")}
                                                {index !== 0 && <ArrowUpDown className="ml-2 h-4 w-4"/>}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableHeader>
                    <TableBody {...getTableBodyProps()}>
                        {rows.map(row => {
                            prepareRow(row);
                            const {key, ...rowProps} = row.getRowProps();
                            return (
                                <TableRow
                                    key={key}
                                    {...rowProps}
                                    onClick={() => handleRowClick(row)}
                                    style={{cursor: "pointer"}}
                                >
                                    {row.cells.map(cell => {
                                        const {key, ...cellProps} = cell.getCellProps();
                                        return (
                                            <TableCell
                                                key={key}
                                                {...cellProps}
                                                data-testid={cell.column.id}
                                            >
                                                {cell.render("Cell")}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
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
