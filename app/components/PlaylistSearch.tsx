// C:\Users\IdeaProjects\playlist-viewer-next-frontend\app\components\PlaylistSearch.tsx

"use client";

import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import {useState, useMemo} from "react";
import {useTable, Column, Row} from "react-table";

import {Button} from "@/app/components/ui/button";
import {Input} from "@/app/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/app/components/ui/form";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/app/components/ui/table";
import {Card, CardContent, CardHeader, CardTitle} from "@/app/components/ui/card";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/app/components/ui/radio-group"

interface Playlist {
    id: string;
    name: string;
    description: string;
    images: { url: string }[];
}

interface SearchFormInputs {
    query: string;
    searchType: 'name' | 'id';
}

const schema = yup
    .object({
        query: yup
            .string()
            .required("検索クエリを入力してください")
            .min(2, "最低2文字以上入力してください"),
        searchType: yup
            .string()
            .oneOf(['name', 'id'])
            .required("検索タイプを選択してください")
    })
    .required();

export default function PlaylistSearch() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    
    const form = useForm<SearchFormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            searchType: 'name'
        }
    });
    
    const onSubmit = async (data: SearchFormInputs) => {
        try {
            const response = await axios.get(
                `/api/playlists/search?${data.searchType}=${data.query}`
            );
            setPlaylists(response.data);
        } catch (error) {
            console.error("Error searching playlists:", error);
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
    
    const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} =
        useTable({columns, data: playlists});
    
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
                                        <Input placeholder="プレイリスト名またはIDを入力" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="searchType"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <RadioGroup {...field} className="flex flex-row gap-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="name" id="searchByName"/>
                                                <label htmlFor="searchByName">プレイリスト名で検索</label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="id" id="searchById"/>
                                                <label htmlFor="searchById">プレイリストIDで検索</label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Search</Button>
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
