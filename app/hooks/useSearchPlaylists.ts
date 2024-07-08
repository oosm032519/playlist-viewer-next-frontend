import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {Playlist} from "../types/playlist";

const searchPlaylists = async ({query, page, limit}: { query: string, page: number, limit: number }) => {
    const response = await axios.get<Playlist[]>(
        `/api/playlists/search?query=${query}&offset=${(page - 1) * limit
        }&limit=${limit}`
    );
    return response.data;
};

export const useSearchPlaylists = (onSearch: (playlists: Playlist[]) => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: searchPlaylists,
        onSuccess: (data, variables) => {
            onSearch(data);
            queryClient.setQueryData(
                ["playlists", variables.query, variables.page],
                data
            );
        },
        onError: (error: any) => {
            console.error("プレイリスト検索中にエラーが発生しました:", error);
        },
    });
};
