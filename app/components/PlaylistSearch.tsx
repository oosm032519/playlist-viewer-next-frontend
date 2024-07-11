// app/components/PlaylistSearch.tsx

"use client";

import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useMemo} from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from "@tanstack/react-table";
import {useQuery} from "@tanstack/react-query";

import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Form, FormControl, FormField, FormItem, FormMessage} from "./ui/form";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "./ui/table";
import {Card, CardContent, CardHeader, CardTitle} from "./ui/card";

// プレイリストのインターフェース定義
interface Playlist {
    id: string;
    name: string;
    description: string;
    images: { url: string }[];
}

// 検索フォームの入力データのインターフェース定義
interface SearchFormInputs {
    query: string;
}

// バリデーションスキーマの定義
const schema = yup
    .object({
        query: yup
            .string()
            .required("検索クエリを入力してください")
            .min(2, "最低2文字以上入力してください"),
    })
    .required();

/**
 * プレイリストを検索する非同期関数
 * @param query - 検索クエリ
 * @returns プレイリストの配列
 */
const fetchPlaylists = async (query: string): Promise<Playlist[]> => {
    const response = await fetch(`/api/playlists/search?query=${query}`);
    if (!response.ok) {
        throw new Error('ネットワークの応答が正しくありません');
    }
    return response.json();
};

/**
 * プレイリスト検索コンポーネント
 * @returns プレイリスト検索フォームと結果表示テーブル
 */
export default function PlaylistSearch() {
    // フォームの設定
    const form = useForm<SearchFormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {query: ''},
    });
    
    // プレイリストデータの取得と状態管理
    const {data: playlists = [], isLoading, refetch} = useQuery({
        queryKey: ['playlists', form.watch('query')],
        queryFn: () => fetchPlaylists(form.getValues('query')),
        enabled: false, // クエリを手動でトリガーするために初期状態では無効化
    });
    
    // フォーム送信時の処理
    const onSubmit = async (data: SearchFormInputs) => {
        refetch();
    };
    
    // テーブルのカラム設定
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
    
    // テーブルの設定
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
