"use client";

import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import {useState, useMemo, useEffect} from "react";
import {useTable, Column, Row} from "react-table";

import {Button} from "@/app/components/ui/button";
import {Input} from "@/app/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/app/components/ui/form";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/app/components/ui/table";
import {Card, CardContent, CardHeader, CardTitle} from "@/app/components/ui/card";

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

export default function PlaylistSearch() {
    console.log("PlaylistSearch コンポーネントがレンダリングされました");
    
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    
    const form = useForm<SearchFormInputs>({
        resolver: yupResolver(schema),
    });
    
    console.log("useForm フックが初期化されました");
    
    const onSubmit = async (data: SearchFormInputs) => {
        console.log("フォームが送信されました。検索クエリ:", data.query);
        try {
            console.log("APIリクエストを送信中...");
            const response = await axios.get(
                `/api/playlists/search?query=${data.query}`
            );
            console.log("APIレスポンスを受信しました:", response.data);
            setPlaylists(response.data);
        } catch (error) {
            console.error("プレイリスト検索中にエラーが発生しました:", error);
        }
    };
    
    const columns = useMemo<Column<Playlist>[]>(
        () => [
            {
                Header: "Image",
                accessor: "images",
                Cell: ({value}: { value: { url: string }[] }) => (
                    <img src={value[0]?.url} alt="Playlist" className="w-12 h-12 rounded-full"/>
                ),
            },
            {
                Header: "Name",
                accessor: "name",
            },
        ],
        []
    );
    
    console.log("テーブルのカラムが定義されました");
    
    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} =
        useTable({columns, data: playlists});
    
    console.log("react-table フックが初期化されました");
    
    useEffect(() => {
        console.log("プレイリストの状態が更新されました:", playlists);
    }, [playlists]);
    
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
                                            <Input placeholder="Enter playlist name" {...field} />
                                            <Button type="submit">Search</Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                
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
                        {rows.map((row: Row<Playlist>) => {
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
            </CardContent>
        </Card>
    );
}
