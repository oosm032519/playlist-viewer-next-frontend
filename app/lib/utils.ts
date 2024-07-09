import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const addTrackToPlaylist = async (playlistId: string, trackId: string) => {
    try {
        const response = await fetch("/api/playlist/add-track", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({playlistId, trackId}),
        });
        
        if (response.ok) {
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
        const response = await fetch("/api/playlists/remove-track", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({playlistId, trackId}),
        });
        
        if (response.ok) {
            console.log("曲が正常に削除されました");
            return true;
        } else {
            console.error("曲の削除に失敗しました", await response.json());
            return false;
        }
    } catch (error) {
        console.error("エラーが発生しました:", error);
        return false;
    }
};
