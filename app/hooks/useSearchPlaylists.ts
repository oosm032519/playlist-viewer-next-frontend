import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {Playlist} from "../types/playlist";

const searchPlaylists = async ({
                                   query,
                                   page,
                                   limit,
                               }: {
    query: string;
    page: number;
    limit: number;
}) => {
    const response = await axios.get<Playlist[]>(
        `/api/playlists/search?query=${query}&offset=${
            (page - 1) * limit
        }&limit=${limit}`
    );
    return response.data;
};

export const useSearchPlaylists = (
    onSearch: (playlists: Playlist[]) => void
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: searchPlaylists,
        onSuccess: (data, variables) => {
            // ページごとの結果をキャッシュ
            queryClient.setQueryData(
                ["playlists", variables.query, variables.page],
                data
            );
            
            // 現在のページのデータを取得して onSearch に渡す
            const cachedData = queryClient.getQueryData([
                "playlists",
                variables.query,
                variables.page,
            ]) as Playlist[] | undefined;
            onSearch(cachedData || []);
        },
        onError: (error: any) => {
            console.error("プレイリスト検索中にエラーが発生しました:", error);
        },
    });
};
