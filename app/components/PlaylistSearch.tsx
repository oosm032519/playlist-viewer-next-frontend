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
import DOMPurify from 'dompurify';
import {Button} from "@/app/components/ui/button";
import {Input} from "@/app/components/ui/input";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/app/components/ui/form";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/app/components/ui/table";
import {Card, CardContent, CardHeader, CardTitle} from "@/app/components/ui/card";
import Image from "next/image";

/**
 * プレイリストのインターフェース
 */
interface Playlist {
    id: string;
    name: string;
    description: string;
    images: { url: string }[];
}

/**
 * 検索フォームの入力インターフェース
 */
interface SearchFormInputs {
    query: string;
}

/**
 * 検索フォームのバリデーションスキーマ
 */
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
 * @throws ネットワークエラー
 */
const fetchPlaylists = async (query: string): Promise<Playlist[]> => {
    const response = await fetch(`/api/playlists/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
        throw new Error('ネットワークの応答が正しくありません');
    }
    return response.json();
};

/**
 * プレイリスト検索コンポーネント
 * @returns JSX.Element
 */
export default function PlaylistSearch() {
    // フォームのセットアップ
    const form = useForm<SearchFormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {query: ''},
    });
    
    // プレイリストデータの取得
    const {data: playlists = [], isLoading, refetch} = useQuery({
        queryKey: ['playlists', form.watch('query')],
        queryFn: () => fetchPlaylists(form.getValues('query')),
        enabled: false, // 手動でのフェッチを有効にする
    });
    
    /**
     * フォーム送信時の処理
     * @param data - フォームデータ
     */
    const onSubmit = async (data: SearchFormInputs) => {
        refetch(); // データの再取得
    };
    
    // テーブルのカラム設定
    const columnHelper = createColumnHelper<Playlist>();
    
    const columns = useMemo(
        () => [
            columnHelper.accessor("images", {
                header: "Image",
                cell: (info) => {
                    const imageUrl = info.getValue()[2]?.url;
                    return imageUrl ? (
                        <div className="w-12 h-12 relative">
                            <Image
                                src={DOMPurify.sanitize(imageUrl, {ALLOWED_TAGS: [], ALLOWED_ATTR: []})}
                                alt="Playlist"
                                className="object-contain w-full h-full"
                                width={60}
                                height={60}
                            />
                        </div>
                    ) : null;
                },
            }),
            columnHelper.accessor("name", {
                header: "Name",
                cell: (info) => {
                    const sanitizedName = DOMPurify.sanitize(info.getValue());
                    return <span>{sanitizedName}</span>;
                },
            }),
        ],
        []
    );
    
    // テーブルのセットアップ
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
