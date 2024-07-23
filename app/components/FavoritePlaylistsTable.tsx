// app/components/FavoritePlaylistsTable.tsx
"use client";

import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table';
import {format} from 'date-fns';
import {usePlaylist} from '@/app/context/PlaylistContext';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';

interface FavoritePlaylist {
    playlistId: string;
    playlistName: string;
    playlistOwnerName: string;
    totalTracks: number;
    addedAt: string;
}

const fetchFavoritePlaylists = async (): Promise<FavoritePlaylist[]> => {
    const response = await fetch('/api/playlists/favorite', {
        credentials: 'include',
    });
    
    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }
    
    return response.json();
};

const FavoritePlaylistsTable: React.FC = () => {
    const {setSelectedPlaylistId} = usePlaylist();
    const {data: playlists, isLoading, error} = useQuery<FavoritePlaylist[], Error>({
        queryKey: ['favoritePlaylists'],
        queryFn: fetchFavoritePlaylists,
    });
    
    // ソート状態を管理するための state
    const [sorting, setSorting] = React.useState<SortingState>([]);
    
    // カラムの定義
    const columns: ColumnDef<FavoritePlaylist>[] = React.useMemo(
        () => [
            {
                accessorKey: 'playlistName',
                header: 'プレイリスト名',
            },
            {
                accessorKey: 'playlistOwnerName',
                header: '作成者',
            },
            {
                accessorKey: 'totalTracks',
                header: '楽曲数',
            },
            {
                accessorKey: 'addedAt',
                header: 'お気に入り追加日時',
                cell: ({getValue}) => format(new Date(getValue() as string), 'yyyy/MM/dd HH:mm'),
            },
        ],
        []
    );
    
    // テーブルインスタンスの作成
    const table = useReactTable({
        data: playlists || [],
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });
    
    if (isLoading) {
        return <div>Loading...</div>;
    }
    
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    
    return (
        <>
            <h2 className="text-2xl font-bold mb-4">お気に入り</h2>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} onClick={header.column.getToggleSortingHandler()}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {{
                                        asc: ' ▲',
                                        desc: ' ▼',
                                    }[header.column.getIsSorted() as string] ?? null}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            onClick={() => setSelectedPlaylistId(row.original.playlistId)}
                            style={{cursor: "pointer"}}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};

export default FavoritePlaylistsTable;
