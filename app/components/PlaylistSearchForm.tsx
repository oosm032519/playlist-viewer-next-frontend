"use client";

import {useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {schema} from "../validationSchema";
import {useSearchPlaylists} from "../hooks/useSearchPlaylists";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "./ui/form";
import {Card, CardContent, CardHeader, CardTitle} from "./ui/card";
import LoadingSpinner from "./LoadingSpinner";
import {Playlist} from "../types/playlist";
import {useQueryClient} from "@tanstack/react-query";
import PaginationButtons from "./PaginationButtons";

interface SearchFormInputs {
    query: string;
}

interface PlaylistSearchFormProps {
    onSearch(playlists: Playlist[]): void;
}

export default function PlaylistSearchForm({
                                               onSearch,
                                           }: PlaylistSearchFormProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPlaylists, setCurrentPlaylists] = useState<Playlist[]>([]);
    const queryClient = useQueryClient();
    
    const form = useForm<SearchFormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {query: ""},
    });
    
    const searchMutation = useSearchPlaylists((data) => {
        onSearch(data);
        setCurrentPlaylists(data);
    });
    
    const onSubmit = async (data: SearchFormInputs) => {
        setCurrentPage(1);
        searchMutation.mutate({query: data.query, page: 1, limit: 20});
    };
    
    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
        searchMutation.mutate({
            query: form.getValues("query"),
            page: currentPage + 1,
            limit: 20,
        });
    };
    
    const handlePrevPage = () => {
        const prevPage = currentPage - 1;
        setCurrentPage(prevPage);
        
        // キャッシュからデータを取得
        const cachedData = queryClient.getQueryData([
            "playlists",
            form.getValues("query"),
            prevPage,
        ]) as Playlist[] | undefined;
        
        if (cachedData) {
            // キャッシュがある場合はキャッシュからデータを設定
            setCurrentPlaylists(cachedData);
        } else {
            // キャッシュがない場合はAPIリクエストを送信
            searchMutation.mutate({
                query: form.getValues("query"),
                page: prevPage,
                limit: 20,
            });
        }
    };
    
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Enter Playlist Name</CardTitle>
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
                                                    {...field}
                                                    disabled={searchMutation.isPending}
                                                />
                                                <Button
                                                    type="submit"
                                                    disabled={searchMutation.isPending}
                                                >
                                                    {searchMutation.isPending ? "Searching..." : "Search"}
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
            <LoadingSpinner loading={searchMutation.isPending}/>
            {currentPlaylists.length > 0 && ( // 条件を追加
                <PaginationButtons
                    currentPage={currentPage}
                    isPending={searchMutation.isPending}
                    hasNextPage={currentPlaylists.length === 20}
                    onNextPage={handleNextPage}
                    onPrevPage={handlePrevPage}
                />
            )}
        </>
    );
}
