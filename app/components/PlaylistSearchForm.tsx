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
import {Card, CardContent} from "./ui/card";
import LoadingSpinner from "./LoadingSpinner";
import {Playlist} from "../types/playlist";

interface SearchFormInputs {
    query: string;
}

interface PlaylistSearchFormProps {
    onSearch(playlists: Playlist[], totalPlaylists: number): void;
}

export default function PlaylistSearchForm({
                                               onSearch,
                                           }: PlaylistSearchFormProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPlaylists, setCurrentPlaylists] = useState<Playlist[]>([]);
    
    const form = useForm<SearchFormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {query: ""},
    });
    
    const searchMutation = useSearchPlaylists((data) => {
        onSearch(data, data.length);
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
    
    return (
        <>
            <Card>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
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
                                                    {searchMutation.isPending
                                                        ? "Searching..."
                                                        : "Search"}
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
            <Button
                onClick={handleNextPage}
                disabled={searchMutation.isPending || currentPlaylists.length < 20}
            >
                Next
            </Button>
        </>
    );
}
