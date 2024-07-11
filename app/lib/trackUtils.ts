// app/lib/trackUtils.ts

import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

/**
 * クラス名を結合し、Tailwind CSSのクラス名をマージする関数
 * @param {...ClassValue[]} inputs - 結合するクラス名のリスト
 * @returns {string} - マージされたクラス名の文字列
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * プレイリストに曲を追加する非同期関数
 * @param {string} playlistId - プレイリストのID
 * @param {string} trackId - 追加する曲のID
 * @returns {Promise<boolean>} - 曲の追加が成功したかどうかを示すブール値
 */
export const addTrackToPlaylist = async (playlistId: string, trackId: string): Promise<boolean> => {
    try {
        // APIエンドポイントにPOSTリクエストを送信
        const response = await fetch("/api/playlist/add-track", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({playlistId, trackId}),
        });
        
        // レスポンスが正常かどうかをチェック
        if (response.ok) {
            console.log("曲が正常に追加されました");
            return true;
        } else {
            console.error("曲の追加に失敗しました");
            return false;
        }
    } catch (error) {
        // エラーハンドリング
        console.error("エラーが発生しました:", error);
        return false;
    }
};

/**
 * プレイリストから曲を削除する非同期関数
 * @param {string} playlistId - プレイリストのID
 * @param {string} trackId - 削除する曲のID
 * @returns {Promise<boolean>} - 曲の削除が成功したかどうかを示すブール値
 */
export const removeTrackFromPlaylist = async (playlistId: string, trackId: string): Promise<boolean> => {
    try {
        // APIエンドポイントにPOSTリクエストを送信
        const response = await fetch("/api/playlists/remove-track", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({playlistId, trackId}),
        });
        
        // レスポンスが正常かどうかをチェック
        if (response.ok) {
            console.log("曲が正常に削除されました");
            return true;
        } else {
            // エラーレスポンスの内容を取得
            const errorData = await response.json();
            console.error("曲の削除に失敗しました", errorData);
            return false;
        }
    } catch (error) {
        // エラーハンドリング
        console.error("エラーが発生しました:", error);
        return false;
    }
};
