// app/components/PlaylistSearchForm.tsx

"use client";

import {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

import {Button} from "@/app/components/ui/button";
import {Input} from "@/app/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/app/components/ui/form";
import {
    Card,
    CardContent,
} from "@/app/components/ui/card";
import LoadingSpinner from "./LoadingSpinner"; // 導入

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

interface PlaylistSearchFormProps {
    onSearch(playlists: any): void; // 型定義を適切なものに変更
}

export default function PlaylistSearchForm({onSearch}: PlaylistSearchFormProps) {
    console.log("PlaylistSearchForm: コンポーネントがレンダリングされました"); // 追加: コンポーネントのレンダリング時のログ
    
    const [isLoading, setIsLoading] = useState(false); // ローディング状態
    
    const form = useForm<SearchFormInputs>({
        resolver: yupResolver(schema),
    });
    
    console.log("PlaylistSearchForm: フォームの初期状態:", form.getValues()); // 追加: フォームの初期状態をログ出力
    
    useEffect(() => {
        console.log("PlaylistSearchForm: useEffect フックが実行されました"); // 追加: useEffect実行時のログ
    }, []);
    
    const onSubmit = async (data: SearchFormInputs) => {
        console.log("PlaylistSearchForm: フォームがサブミットされました。クエリ:", data.query); // 追加: フォームサブミット時のログ
        setIsLoading(true);
        console.log("PlaylistSearchForm: ローディング状態を true に設定しました"); // 追加: ローディング状態変更のログ
        try {
            console.log("PlaylistSearchForm: APIリクエストを開始します"); // 追加: APIリクエスト開始のログ
            const response = await axios.get(`/api/playlists/search?query=${data.query}`);
            console.log("PlaylistSearchForm: APIレスポンスを受信しました:", response.data); // 追加: APIレスポンス受信のログ
            onSearch(response.data);
            console.log("PlaylistSearchForm: 検索結果を親コンポーネントに渡しました"); // 追加: 検索結果受け渡しのログ
        } catch (error: any) {
            console.error("PlaylistSearchForm: プレイリスト検索中にエラーが発生しました:", error);
        } finally {
            setIsLoading(false);
            console.log("PlaylistSearchForm: ローディング状態を false に設定しました"); // 追加: ローディング状態変更のログ
            form.reset();
            console.log("PlaylistSearchForm: フォームをリセットしました"); // 追加: フォームリセットのログ
        }
    };
    
    return (
        <>
            <Card>
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
                                                    {...field}
                                                    value={field.value || ''}
                                                    disabled={isLoading}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        console.log("PlaylistSearchForm: 入力値が変更されました:", e.target.value); // 追加: 入力値変更のログ
                                                    }}
                                                />
                                                <Button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    onClick={() => console.log("PlaylistSearchForm: 検索ボタンがクリックされました")} // 追加: ボタンクリック時のログ
                                                >
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
                </CardContent>
            </Card>
            <LoadingSpinner loading={isLoading}/> {/* ローディングアニメーションの表示 */}
        </>
    );
}
