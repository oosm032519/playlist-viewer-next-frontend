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
                accessor: "album", // ネストしたオブジェクトにアクセスするため、"album.name" から "album" に変更
                Cell: ({value}) => value.name, // Cell内でalbumオブジェクトからnameプロパティを取得
            },
        ],
        []
    );
    
    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} =
        useTable({columns, data: tracks});
    
    return (
        <Table {...getTableProps()} className="mt-8">
            <TableHeader>
                {headerGroups.map((headerGroup) => (
                    <TableRow {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <TableHead {...column.getHeaderProps()}>
                                {column.render("Header")}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody {...getTableBodyProps()}>
                {rows.map((row: Row<Track>) => {
                    prepareRow(row);
                    return (
                        <TableRow {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                                <TableCell {...cell.getCellProps()}>
                                    {cell.render("Cell")}
                                </TableCell>
                            ))}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default PlaylistDetails;
