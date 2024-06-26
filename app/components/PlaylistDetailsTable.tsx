"use client";

import React, {useMemo} from "react";
import {useTable, useSortBy, Column, Row, HeaderGroup} from "react-table";
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

interface PlaylistDetailsTableProps {
    tracks: Track[];
}

export const PlaylistDetailsTable: React.FC<PlaylistDetailsTableProps> = ({
                                                                              tracks,
                                                                          }) => {
    const columns = useMemo<Column<Track>[]>(
        () => [
            {
                Header: "Album",
                accessor: "album",
                Cell: ({value}) => (
                    <div className="w-16 h-16 relative">
                        <Image
                            src={value.images[2].url}
                            alt={value.name}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
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
                Cell: ({value}) => value[0].name,
            },
            {
                Header: "Danceability",
                accessor: (row: Track) => row.audioFeatures?.danceability,
                sortType: (
                    a: { original: { audioFeatures: { danceability: any } } },
                    b: { original: { audioFeatures: { danceability: any } } }
                ) => {
                    const aValue = a.original.audioFeatures?.danceability;
                    const bValue = b.original.audioFeatures?.danceability;
                    if (aValue === undefined) return 1;
                    if (bValue === undefined) return -1;
                    return aValue - bValue;
                },
                Cell: ({value}: { value: number | undefined }) =>
                    value?.toFixed(3) ?? "-",
            },
            {
                Header: "Energy",
                accessor: (row: Track) => row.audioFeatures?.energy,
                sortType: (
                    a: { original: { audioFeatures: { energy: any } } },
                    b: { original: { audioFeatures: { energy: any } } }
                ) => {
                    const aValue = a.original.audioFeatures?.energy;
                    const bValue = b.original.audioFeatures?.energy;
                    if (aValue === undefined) return 1;
                    if (bValue === undefined) return -1;
                    return aValue - bValue;
                },
                Cell: ({value}: { value: number | undefined }) =>
                    value?.toFixed(3) ?? "-",
            },
            {
                Header: "Key",
                accessor: (row: Track) => row.audioFeatures?.key,
                sortType: (
                    a: { original: { audioFeatures: { key: any } } },
                    b: { original: { audioFeatures: { key: any } } }
                ) => {
                    const aValue = a.original.audioFeatures?.key;
                    const bValue = b.original.audioFeatures?.key;
                    if (aValue === undefined) return 1;
                    if (bValue === undefined) return -1;
                    return aValue - bValue;
                },
                Cell: ({value}: { value: number | undefined }) =>
                    value !== undefined ? value.toString() : "-",
            },
            {
                Header: "Loudness",
                accessor: (row: Track) => row.audioFeatures?.loudness,
                sortType: (
                    a: { original: { audioFeatures: { loudness: any } } },
                    b: { original: { audioFeatures: { loudness: any } } }
                ) => {
                    const aValue = a.original.audioFeatures?.loudness;
                    const bValue = b.original.audioFeatures?.loudness;
                    if (aValue === undefined) return 1;
                    if (bValue === undefined) return -1;
                    return aValue - bValue;
                },
                Cell: ({value}: { value: number | undefined }) =>
                    value?.toFixed(3) ?? "-",
            },
            {
                Header: "Mode",
                accessor: (row: Track) => row.audioFeatures?.mode,
                Cell: ({value}: { value: number | undefined }) =>
                    value !== undefined ? (value === 1 ? "MAJOR" : "MINOR") : "-",
            },
            {
                Header: "Speechiness",
                accessor: (row: Track) => row.audioFeatures?.speechiness,
                sortType: (
                    a: { original: { audioFeatures: { speechiness: any } } },
                    b: { original: { audioFeatures: { speechiness: any } } }
                ) => {
                    const aValue = a.original.audioFeatures?.speechiness;
                    const bValue = b.original.audioFeatures?.speechiness;
                    if (aValue === undefined) return 1;
                    if (bValue === undefined) return -1;
                    return aValue - bValue;
                },
                Cell: ({value}: { value: number | undefined }) =>
                    value?.toFixed(3) ?? "-",
            },
            {
                Header: "Acousticness",
                accessor: (row: Track) => row.audioFeatures?.acousticness,
                sortType: (
                    a: { original: { audioFeatures: { acousticness: any } } },
                    b: { original: { audioFeatures: { acousticness: any } } }
                ) => {
                    const aValue = a.original.audioFeatures?.acousticness;
                    const bValue = b.original.audioFeatures?.acousticness;
                    if (aValue === undefined) return 1;
                    if (bValue === undefined) return -1;
                    return aValue - bValue;
                },
                Cell: ({value}: { value: number | undefined }) =>
                    value?.toFixed(3) ?? "-",
            },
            {
                Header: "Instrumentalness",
                accessor: (row: Track) => row.audioFeatures?.instrumentalness,
                sortType: (
                    a: { original: { audioFeatures: { instrumentalness: any } } },
                    b: { original: { audioFeatures: { instrumentalness: any } } }
                ) => {
                    const aValue = a.original.audioFeatures?.instrumentalness;
                    const bValue = b.original.audioFeatures?.instrumentalness;
                    if (aValue === undefined) return 1;
                    if (bValue === undefined) return -1;
                    return aValue - bValue;
                },
                Cell: ({value}: { value: number | undefined }) =>
                    value?.toFixed(3) ?? "-",
            },
            {
                Header: "Liveness",
                accessor: (row: Track) => row.audioFeatures?.liveness,
                sortType: (
                    a: { original: { audioFeatures: { liveness: any } } },
                    b: { original: { audioFeatures: { liveness: any } } }
                ) => {
                    const aValue = a.original.audioFeatures?.liveness;
                    const bValue = b.original.audioFeatures?.liveness;
                    if (aValue === undefined) return 1;
                    if (bValue === undefined) return -1;
                    return aValue - bValue;
                },
                Cell: ({value}: { value: number | undefined }) =>
                    value?.toFixed(3) ?? "-",
            },
            {
                Header: "Valence",
                accessor: (row: Track) => row.audioFeatures?.valence,
                sortType: (
                    a: { original: { audioFeatures: { valence: any } } },
                    b: { original: { audioFeatures: { valence: any } } }
                ) => {
                    const aValue = a.original.audioFeatures?.valence;
                    const bValue = b.original.audioFeatures?.valence;
                    if (aValue === undefined) return 1;
                    if (bValue === undefined) return -1;
                    return aValue - bValue;
                },
                Cell: ({value}: { value: number | undefined }) =>
                    value?.toFixed(3) ?? "-",
            },
            {
                Header: "Tempo",
                accessor: (row: Track) => row.audioFeatures?.tempo,
                sortType: (
                    a: { original: { audioFeatures: { tempo: any } } },
                    b: { original: { audioFeatures: { tempo: any } } }
                ) => {
                    const aValue = a.original.audioFeatures?.tempo;
                    const bValue = b.original.audioFeatures?.tempo;
                    if (aValue === undefined) return 1;
                    if (bValue === undefined) return -1;
                    return aValue - bValue;
                },
                Cell: ({value}: { value: number | undefined }) =>
                    value?.toFixed(3) ?? "-",
            },
            {
                Header: "Duration (ms)",
                accessor: (row: Track) => row.durationMs,
                sortType: (
                    a: { original: { durationMs: any } },
                    b: { original: { durationMs: any } }
                ) => {
                    const aValue = a.original.durationMs;
                    const bValue = b.original.durationMs;
                    if (aValue === undefined) return 1;
                    if (bValue === undefined) return -1;
                    return aValue - bValue;
                },
                Cell: ({value}: { value: number | undefined }) =>
                    value !== undefined ? value.toString() : "-",
            },
            {
                Header: "Time Signature",
                accessor: (row: Track) => row.audioFeatures?.timeSignature,
                sortType: (
                    a: { original: { audioFeatures: { timeSignature: any } } },
                    b: { original: { audioFeatures: { timeSignature: any } } }
                ) => {
                    const aValue = a.original.audioFeatures?.timeSignature;
                    const bValue = b.original.audioFeatures?.timeSignature;
                    if (aValue === undefined) return 1;
                    if (bValue === undefined) return -1;
                    return aValue - bValue;
                },
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
    
    return (
        <div className="overflow-x-auto w-full relative">
            <Table {...getTableProps()} className="mt-8">
                <TableHeader>
                    {headerGroups.map((headerGroup: HeaderGroup<Track>) => {
                        const {key, ...restHeaderGroupProps} =
                            headerGroup.getHeaderGroupProps();
                        return (
                            <TableRow key={key} {...restHeaderGroupProps}>
                                {headerGroup.headers.map((column, index) => {
                                    const {key, ...restColumnProps} = column.getHeaderProps(
                                        (column as any).getSortByToggleProps()
                                    );
                                    return (
                                        <TableHead
                                            key={key}
                                            {...restColumnProps}
                                            className={index === 0 ? "sticky left-0 z-10 bg-gray-dark" : ""}
                                        >
                                            <div className="flex items-center">
                                                {column.render("Header")}
                                                {index !== 0 && <ArrowUpDown className="ml-2 h-4 w-4"/>}
                                            </div>
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
                            <TableRow key={key} {...restRowProps}>
                                {row.cells.map((cell, index) => {
                                    const {key, ...restCellProps} = cell.getCellProps();
                                    return (
                                        <TableCell
                                            key={key}
                                            {...restCellProps}
                                            className={index === 0 ? "sticky left-0 z-10 bg-gray-dark" : ""}
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
    );
};
