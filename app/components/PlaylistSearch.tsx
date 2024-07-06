"use client";

import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import {useMemo, useState} from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";

import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Form, FormControl, FormField, FormItem, FormMessage} from "./ui/form";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "./ui/table";
import {Card, CardContent, CardHeader, CardTitle} from "./ui/card";

interface Playlist {
    id: string;
    name: string;
    description: string;
    images: { url: string }[];
}

interface SearchFormInputs {
    query: string;
}

const schema = yup
    .object({
        query: yup
            .string()
            .required("検索クエリを入力してください")
            .min(2, "最低2文字以上入力してください"),
    })
    .required();

const searchPlaylists = async (query: string): Promise<Playlist[]> => {
    try {
        const response = await axios.get(`/api/playlists/search?query=${query}`);
        return response.data;
    } catch (error) {
        console.error("プレイリスト検索中にエラーが発生しました:", error);
        return [];
    }
};

export default function PlaylistSearch() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const form = useForm<SearchFormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {query: ''},
    });
    
    const onSubmit = async (data: SearchFormInputs) => {
        setIsLoading(true);
        const results = await searchPlaylists(data.query);
        setPlaylists(results);
        setIsLoading(false);
    };
    
    const columnHelper = createColumnHelper<Playlist>();
    
    const columns = useMemo(
        () => [
            columnHelper.accessor("images", {
                header: "Image",
                cell: (info) => (
                    <img
                        src={info.getValue()[0]?.url}
                        alt="Playlist"
                        className="w-12 h-12 object-cover rounded-full"
                    />
                ),
            }),
            columnHelper.accessor("name", {
                header: "Name",
            }),
        ],
        []
    );
    
    const table = useReactTable({
        data: playlists,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    
    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Playlist Search</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="query"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex space-x-2">
                                            <Input
                                                placeholder="Enter playlist name"
                                                aria-label="Enter playlist name"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                            <Button type="submit" disabled={isLoading}>
                                                {isLoading ? "Searching..." : "Search"}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                
                <Table className="mt-8">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
