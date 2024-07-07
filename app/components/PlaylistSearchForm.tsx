"use client";

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
import {
    Card,
    CardContent,
} from "./ui/card";
import LoadingSpinner from "./LoadingSpinner";
import {Playlist} from "../types/playlist";

interface SearchFormInputs {
    query: string;
}

interface PlaylistSearchFormProps {
    onSearch(playlists: Playlist[]): void;
}

export default function PlaylistSearchForm({onSearch}: PlaylistSearchFormProps) {
    const form = useForm<SearchFormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {query: ""},
    });
    
    const searchMutation = useSearchPlaylists((data) => {
        onSearch(data);
    });
    
    const onSubmit = async (data: SearchFormInputs) => {
        searchMutation.mutate(data.query);
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
        </>
    );
}
