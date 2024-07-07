import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {Playlist} from "../types/playlist";

const searchPlaylists = async (query: string) => {
    const response = await axios.get<Playlist[]>(`/api/playlists/search?query=${query}`);
    return response.data;
};

export const useSearchPlaylists = (onSearch: (playlists: Playlist[], query: string) => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: searchPlaylists,
        onSuccess: (data, variables) => {
            onSearch(data, variables);
            queryClient.setQueryData(['playlists', variables], data);
        },
        onError: (error: any) => {
            console.error("プレイリスト検索中にエラーが発生しました:", error);
        },
    });
};
