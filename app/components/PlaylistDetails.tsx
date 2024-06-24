// C:\Users\IdeaProjects\playlist-viewer-next-frontend\app\components\PlaylistDetails.tsx
// app/components/PlaylistDetails.tsx
"use client";

import {useMemo} from "react";
import {useTable, Column, Row} from "react-table";
import {Track} from "@/app/types/track";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/components/ui/table";

interface PlaylistDetailsProps {
    tracks: Track[];
}

const PlaylistDetails: React.FC<PlaylistDetailsProps> = ({tracks}) => {
    console.log("PlaylistDetails: レンダリングされたトラックデータ:", tracks);
    
    const columns = useMemo<Column<Track>[]>(
        () => [
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
                Header: "Album",
                accessor: "album",
                Cell: ({value}) => value.name,
            },
            {
                Header: "Danceability",
                accessor: (row: Track) => row.audioFeatures?.danceability,
                // value を number | undefined 型に指定
                Cell: ({value}: { value: number | undefined }) => value?.toFixed(3) ?? "-",
            },
            {
                Header: "Energy",
                accessor: (row: Track) => row.audioFeatures?.energy,
                Cell: ({value}: { value: number | undefined }) => value?.toFixed(3) ?? "-",
            },
            {
                Header: "Key",
                accessor: (row: Track) => row.audioFeatures?.key,
                // value を number | undefined 型に指定
                Cell: ({value}: { value: number | undefined }) => value !== undefined ? value.toString() : "-",
            },
            {
                Header: "Loudness",
                accessor: (row: Track) => row.audioFeatures?.loudness,
                Cell: ({value}: { value: number | undefined }) => value?.toFixed(3) ?? "-",
            },
            {
                Header: "Mode",
                accessor: (row: Track) => row.audioFeatures?.mode,
                // value を number | undefined 型に指定
                Cell: ({value}: { value: number | undefined }) => value !== undefined ? value.toString() : "-",
            },
            {
                Header: "Speechiness",
                accessor: (row: Track) => row.audioFeatures?.speechiness,
                Cell: ({value}: { value: number | undefined }) => value?.toFixed(3) ?? "-",
            },
            {
                Header: "Acousticness",
                accessor: (row: Track) => row.audioFeatures?.acousticness,
                Cell: ({value}: { value: number | undefined }) => value?.toFixed(3) ?? "-",
            },
            {
                Header: "Instrumentalness",
                accessor: (row: Track) => row.audioFeatures?.instrumentalness,
                Cell: ({value}: { value: number | undefined }) => value?.toFixed(3) ?? "-",
            },
            {
                Header: "Liveness",
                accessor: (row: Track) => row.audioFeatures?.liveness,
                Cell: ({value}: { value: number | undefined }) => value?.toFixed(3) ?? "-",
            },
            {
                Header: "Valence",
                accessor: (row: Track) => row.audioFeatures?.valence,
                Cell: ({value}: { value: number | undefined }) => value?.toFixed(3) ?? "-",
            },
            {
                Header: "Tempo",
                accessor: (row: Track) => row.audioFeatures?.tempo,
                Cell: ({value}: { value: number | undefined }) => value?.toFixed(3) ?? "-",
            },
            {
                Header: "Duration (ms)",
                accessor: (row: Track) => row.audioFeatures?.duration_ms,
                // value を number | undefined 型に指定
                Cell: ({value}: { value: number | undefined }) => value !== undefined ? value.toString() : "-",
            },
            {
                Header: "Time Signature",
                accessor: (row: Track) => row.audioFeatures?.time_signature,
                // value を number | undefined 型に指定
                Cell: ({value}: { value: number | undefined }) => value !== undefined ? value.toString() : "-",
            },
        ],
        []
    );
    
    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} =
        useTable({columns, data: tracks});
    
    return (
        <Table {...getTableProps()} className="mt-8">
            <TableHeader>
                {headerGroups.map((headerGroup) => {
                    const {key, ...restHeaderGroupProps} =
                        headerGroup.getHeaderGroupProps();
                    return (
                        <TableRow key={key} {...restHeaderGroupProps}>
                            {headerGroup.headers.map((column) => {
                                const {key, ...restColumnProps} = column.getHeaderProps();
                                return (
                                    <TableHead key={key} {...restColumnProps}>
                                        {column.render("Header")}
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
                            {row.cells.map((cell) => {
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
    );
};

export default PlaylistDetails;
