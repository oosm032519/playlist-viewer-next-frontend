// app/components/PlaylistSearchForm.tsx

"use client";

import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {schema} from "../validationSchema";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "./ui/form";

interface SearchFormInputs {
    query: string;
}

interface PlaylistSearchFormProps {
    onSearch(query: string): void; // 検索クエリを受け取るコールバック関数
}

/**
 * プレイリスト検索フォームコンポーネント
 * @param {PlaylistSearchFormProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} プレイリスト検索フォーム
 */
export default function PlaylistSearchForm({
                                               onSearch,
                                           }: PlaylistSearchFormProps) {
    // フォームの設定
    const form = useForm<SearchFormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {query: ""},
    });
    
    /**
     * フォーム送信時の処理
     * @param {SearchFormInputs} data - フォームの入力データ
     */
    const onSubmit = async (data: SearchFormInputs) => {
        onSearch(data.query); // 検索クエリを PlaylistDisplay に渡す
    };
    
    return (
        <>
            {/* プレイリスト名入力フォーム */}
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
        </>
    );
}
