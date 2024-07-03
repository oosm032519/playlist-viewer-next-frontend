// PlaylistDetailsTable.tsx

"use client";

import React, {useMemo, useState} from "react";
import {
    useTable,
    useSortBy,
    Column,
    Row,
    HeaderGroup,
} from "react-table";
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
import {audioFeatureSort} from "./tableUtils";

interface PlaylistDetailsTableProps {
    tracks: Track[];
}

export const PlaylistDetailsTable: React.FC<PlaylistDetailsTableProps> = ({
                                                                              tracks,
                                                                          }) => {
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
    
    const columns = useMemo<Column<Track>[]>(
        () => [
            {
                Header: "Album",
                accessor: "album",
                Cell: ({value}) => (
                    <Image
                        src={value.images[0].url}
                        alt={value.name}
                        width={50}
                        height={50}
                    />
                ),
                disableSortBy: true,
            },
            {
                Header: "Title",
                accessor: "name",
            },
            {
                Header: "Artist",
                accessor: "artists",
                Cell: ({value}) => <span>{value[0].name}</span>,
            },
            {
                Header: "Danceability",
                accessor: (row: Track) => row.audioFeatures?.danceability,
                sortType: (a: { original: { audioFeatures: { [key: string]: number | undefined; }; }; }, b: { original: { audioFeatures: { [key: string]: number | undefined; }; }; }) => audioFeatureSort(a, b, "danceability"),
                Cell: ({value}: { value: number | undefined }) =>
                    value?.toFixed(3) ?? "-",
            },
            {
                Header: "Energy",
                accessor: (row: Track) => row.audioFeatures?.energy,
                sortType: (a: { original: { audioFeatures: { [key: string]: number | undefined; }; }; }, b: { original: { audioFeatures: { [key: string]: number | undefined; }; }; }) => audioFeatureSort(a, b, "energy"),
                Cell: ({value}: { value: number | undefined }) =>
                    value?.toFixed(3) ?? "-",
            },
            {
                Header: "Key",
                accessor: (row: Track) => row.audioFeatures?.key,
                sortType: (a: { original: { audioFeatures: { [key: string]: number | undefined; }; }; }, b: { original: { audioFeatures: { [key: string]: number | undefined; }; }; }) => audioFeatureSort(a, b, "key"),
                Cell: ({value}: { value: number | undefined }) =>
                    value !== undefined ? value.toString() : "-",
            },
            {
                Header: "Loudness",
                accessor: (row: Track) => row.audioFeatures?.loudness,
                sortType: (a: { original: { audioFeatures: { [key: string]: number | undefined; }; }; }, b: { original: { audioFeatures: { [key: string]: number | undefined; }; }; }) => audioFeatureSort(a, b, "loudness"),
                Cell: ({value}: { value: number | undefined }) =>
                    value?.toFixed(3) ?? "-",
            },
            {
                Header: "Mode",
                accessor: (row: Track) => row.audioFeatures?.mode,
                sortType: (a: { original: { audioFeatures: { mode: string; }; }; }, b: { original: { audioFeatures: { mode: string; }; }; }) => {
                    const modeA = a.original.audioFeatures?.mode ?? ""; // デフォルト値として空文字列を使用
                    const modeB = b.original.audioFeatures?.mode ?? "";
                    return modeA.localeCompare(modeB); // 文字列比較を使用
                },
                Cell: ({value}: { value: string | undefined }) => value ?? "-", // セルの表示を簡略化
            },
            {
                Header: "Speechiness",
                accessor: (row: Track) => row.audioFeatures?.speechiness,
                sortType: (a: { original: { audioFeatures: { [key: string]: number | undefined; }; }; }, b: { original: { audioFeatures: { [key: string]: number | undefined; }; }; }) => audioFeatureSort(a, b, "speechiness"),
                Cell: ({value}: { value: number | undefined }) =>
                    value?.toFixed(3) ?? "-",
            },
            {
                Header: "Acousticness",
                accessor: (row: Track) => row.audioFeatures?.acousticness,
                sortType: (a: { original: { audioFeatures: { [key: string]: number | undefined; }; }; }, b: { original: { audioFeatures: { [key: string]: number | undefined; }; }; }) => audioFeatureSort(a, b, "acousticness"),
                Cell: ({value}: { value: number | undefined }) =>
                    value?.toFixed(3) ?? "-",
            },
            {
                Header: "Instrumentalness",
                accessor: (row: Track) => row.audioFeatures?.instrumentalness,
                sortType: (a: { original: { audioFeatures: { [key: string]: number | undefined; }; }; }, b: { original: { audioFeatures: { [key: string]: number | undefined; }; }; }) => audioFeatureSort(a, b, "instrumentalness"),
                Cell: ({value}: { value: number | undefined }) =>
                    value?.toFixed(3) ?? "-",
            },
            {
                Header: "Liveness",
                accessor: (row: Track) => row.audioFeatures?.liveness,
                sortType: (a: { original: { audioFeatures: { [key: string]: number | undefined; }; }; }, b: { original: { audioFeatures: { [key: string]: number | undefined; }; }; }) => audioFeatureSort(a, b, "liveness"),
                Cell: ({value}: { value: number | undefined }) =>
                    value?.toFixed(3) ?? "-",
            },
            {
                Header: "Valence",
                accessor: (row: Track) => row.audioFeatures?.valence,
                sortType: (a: { original: { audioFeatures: { [key: string]: number | undefined; }; }; }, b: { original: { audioFeatures: { [key: string]: number | undefined; }; }; }) => audioFeatureSort(a, b, "valence"),
                Cell: ({value}: { value: number | undefined }) =>
                    value?.toFixed(3) ?? "-",
            },
            {
                Header: "Tempo",
                accessor: (row: Track) => row.audioFeatures?.tempo,
                sortType: (a: { original: { audioFeatures: { [key: string]: number | undefined; }; }; }, b: { original: { audioFeatures: { [key: string]: number | undefined; }; }; }) => audioFeatureSort(a, b, "tempo"),
                Cell: ({value}: { value: number | undefined }) =>
                    value?.toFixed(3) ?? "-",
            },
            {
                Header: "Duration (ms)",
                accessor: (row: Track) => row.durationMs,
                sortType: (a: { original: { durationMs: number; }; }, b: { original: { durationMs: number; }; }) => a.original.durationMs - b.original.durationMs,
                Cell: ({value}: { value: number | undefined }) =>
                    value !== undefined ? value.toString() : "-",
            },
            {
                Header: "Time Signature",
                accessor: (row: Track) => row.audioFeatures?.timeSignature,
                sortType: (a: { original: { audioFeatures: { [key: string]: number | undefined; }; }; }, b: { original: { audioFeatures: { [key: string]: number | undefined; }; }; }) => audioFeatureSort(a, b, "timeSignature"),
                Cell: ({value}: { value: number | undefined }) =>
                    value !== undefined ? value.toString() : "-",
            },
        ],
        []
    );
    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data: tracks,
        },
        useSortBy
    );
    
    const handleRowClick = (row: Row<Track>) => {
        setSelectedTrack(row.original);
    };
    
    return (
        <div className="flex flex-col">
            <div className="w-full overflow-x-auto">
                <Table {...getTableProps()}>
                    <TableHeader>
                        {headerGroups.map((headerGroup: HeaderGroup<Track>) => {
                            const {key, ...restHeaderGroupProps} =
                                headerGroup.getHeaderGroupProps();
                            return (
                                <TableRow key={key} {...restHeaderGroupProps}>
                                    {headerGroup.headers.map((column, index) => {
                                        const {key, ...restColumnProps} =
                                            column.getHeaderProps(
                                                (column as any).getSortByToggleProps()
                                            );
                                        return (
                                            <TableHead key={key} {...restColumnProps}>
                                                {column.render("Header")}
                                                {index !== 0 && (
                                                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                                                )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableHeader>
                    <TableBody {...getTableBodyProps()}>
                        {rows.map((row: Row<Track>) => {
                            prepareRow(row);
                            const {key, ...restRowProps} = row.getRowProps();
                            return (
                                <TableRow
                                    key={key}
                                    {...restRowProps}
                                    onClick={() => handleRowClick(row)}
                                    style={{cursor: "pointer"}}
                                >
                                    {row.cells.map((cell, index) => {
                                        const {key, ...restCellProps} = cell.getCellProps();
                                        return (
                                            <TableCell key={key} {...restCellProps}>
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
                    <h3 className="text-lg font-semibold mb-4">
                        Audio Features: {selectedTrack.name}
                    </h3>
                    <AudioFeaturesChart track={selectedTrack}/>
                </div>
            )}
        </div>
    );
};
