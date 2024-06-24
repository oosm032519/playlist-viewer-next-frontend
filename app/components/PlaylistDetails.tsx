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
        ],
        []
    );
    
    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} =
        useTable({columns, data: tracks});
    
    return (
        <Table {...getTableProps()} className="mt-8">
            <TableHeader>
                {headerGroups.map((headerGroup) => {
                    const {key, ...restHeaderGroupProps} = headerGroup.getHeaderGroupProps();
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
