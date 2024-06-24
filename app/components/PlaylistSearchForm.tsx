// PlaylistSearchForm.tsx

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
    const [isLoading, setIsLoading] = useState(false);
    
    const form = useForm<SearchFormInputs>({
        resolver: yupResolver(schema),
    });
    
    const onSubmit = async (data: SearchFormInputs) => {
        setIsLoading(true);
        console.log("PlaylistSearchForm: onSubmit called with query:", data.query); // 追加: サブミット時のクエリをコンソール出力
        try {
            const response = await axios.get(`/api/playlists/search?query=${data.query}`);
            console.log("PlaylistSearchForm: API response:", response.data); // 追加: APIレスポンスをコンソール出力
            onSearch(response.data);
        } catch (error: any) {
            console.error("PlaylistSearchForm: Error searching playlists:", error);
        } finally {
            setIsLoading(false);
            form.reset();
        }
    };
    
    return (
        <Card>
            {/* ... */}
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
                                                // valueプロパティを追加
                                                value={field.value || ''}
                                                disabled={isLoading}
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
            </CardContent>
        </Card>
    );
}
