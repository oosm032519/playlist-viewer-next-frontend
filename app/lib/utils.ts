import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

import axios from "axios";

export const addTrackToPlaylist = async (playlistId: string, trackId: string) => {
    try {
        const response = await axios.post("/api/playlist/add-track", {
            playlistId,
            trackId,
        });
        
        if (response.status === 200) {
            console.log("曲が正常に追加されました");
            return true;
        } else {
            console.error("曲の追加に失敗しました");
            return false;
        }
    } catch (error) {
        console.error("エラーが発生しました:", error);
        return false;
    }
};

export const removeTrackFromPlaylist = async (playlistId: string, trackId: string) => {
    try {
        const response = await axios.post("/api/playlists/remove-track", {
            playlistId,
            trackId,
        });
        
        if (response.status === 200) {
            console.log("曲が正常に削除されました");
            return true;
        } else {
            console.error("曲の削除に失敗しました", response.data);
            return false;
        }
    } catch (error) {
        console.error("エラーが発生しました:", error);
        return false;
    }
};
