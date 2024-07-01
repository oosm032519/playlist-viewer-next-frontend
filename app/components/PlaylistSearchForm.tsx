"use client";

import {useState} from "react";
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
import LoadingSpinner from "./LoadingSpinner";
import {Playlist} from "@/app/types/playlist";

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
    onSearch(playlists: Playlist[]): void;
}

export default function PlaylistSearchForm({onSearch}: PlaylistSearchFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<SearchFormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {query: ""}, // 初期値を設定
    });
    
    const searchPlaylists = async (query: string) => {
        try {
            const response = await axios.get<Playlist[]>(`/api/playlists/search?query=${query}`);
            return response.data;
        } catch (error: any) {
            console.error("プレイリスト検索中にエラーが発生しました:", error);
            throw error;
        }
    };
    
    const onSubmit = async (data: SearchFormInputs) => {
        setIsLoading(true);
        try {
            const playlists = await searchPlaylists(data.query);
            onSearch(playlists);
        } catch (error) {
            // エラー処理
        } finally {
            setIsLoading(false);
            // form.reset() を削除
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
                                                    disabled={isLoading}
                                                />
                                                <Button
                                                    type="submit"
                                                    disabled={isLoading}
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
            <LoadingSpinner loading={isLoading}/>
        </>
    );
}
