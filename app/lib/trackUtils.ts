// app/lib/trackUtils.ts

import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

/**
 * クラス名を結合し、Tailwind CSSのクラス名をマージする関数
 *
 * @param {...ClassValue[]} inputs - 結合するクラス名のリスト
 * @returns {string} - マージされたクラス名の文字列
 *
 * @example
 * const className = cn('bg-red-500', 'text-white');
 * // classNameは 'bg-red-500 text-white' となる
 */
export function cn(...inputs: ClassValue[]): string {
    // clsxでクラス名を結合し、twMergeでTailwind CSSのクラス名をマージ
    return twMerge(clsx(inputs));
}

/**
 * プレイリストに曲を追加する非同期関数
 *
 * @param {string} playlistId - プレイリストのID
 * @param {string} trackId - 追加する曲のID
 * @returns {Promise<boolean>} - 曲の追加が成功したかどうかを示すブール値
 *
 * @example
 * const success = await addTrackToPlaylist('playlist123', 'track456');
 * if (success) {
 *   console.log('曲が追加されました');
 * } else {
 *   console.log('曲の追加に失敗しました');
 * }
 */
export const addTrackToPlaylist = async (playlistId: string, trackId: string): Promise<boolean> => {
    console.log(`[addTrackToPlaylist] 開始: playlistId = ${playlistId}, trackId = ${trackId}`);
    try {
        console.log('[addTrackToPlaylist] APIリクエスト送信開始');
        const response = await fetch("/api/playlists/add-track", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({playlistId, trackId}),
            credentials: 'include', // クッキーを含める
        });
        
        console.log(`[addTrackToPlaylist] APIレスポンス受信: ステータス = ${response.status}`);
        
        if (response.ok) {
            console.log("[addTrackToPlaylist] 曲が正常に追加されました");
            return true;
        } else {
            const errorData = await response.text();
            console.error(`[addTrackToPlaylist] 曲の追加に失敗しました。ステータス: ${response.status}, エラー: ${errorData}`);
            return false;
        }
    } catch (error) {
        console.error(`[addTrackToPlaylist] 予期せぬエラーが発生しました:`, error);
        return false;
    } finally {
        console.log('[addTrackToPlaylist] 処理終了');
    }
};

/**
 * プレイリストから曲を削除する非同期関数
 *
 * @param {string} playlistId - プレイリストのID
 * @param {string} trackId - 削除する曲のID
 * @returns {Promise<boolean>} - 曲の削除が成功したかどうかを示すブール値
 *
 * @example
 * const success = await removeTrackFromPlaylist('playlist123', 'track456');
 * if (success) {
 *   console.log('曲が削除されました');
 * } else {
 *   console.log('曲の削除に失敗しました');
 * }
 */
export const removeTrackFromPlaylist = async (playlistId: string, trackId: string): Promise<boolean> => {
    console.log(`[removeTrackFromPlaylist] 開始: playlistId = ${playlistId}, trackId = ${trackId}`);
    try {
        console.log('[removeTrackFromPlaylist] APIリクエスト送信開始');
        const response = await fetch("/api/playlists/remove-track", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({playlistId, trackId}),
            credentials: 'include', // クッキーを含める
        });
        
        console.log(`[removeTrackFromPlaylist] APIレスポンス受信: ステータス = ${response.status}`);
        
        if (response.ok) {
            console.log("[removeTrackFromPlaylist] 曲が正常に削除されました");
            return true;
        } else {
            const errorData = await response.text();
            console.error(`[removeTrackFromPlaylist] 曲の削除に失敗しました。ステータス: ${response.status}, エラー: ${errorData}`);
            return false;
        }
    } catch (error) {
        console.error(`[removeTrackFromPlaylist] 予期せぬエラーが発生しました:`, error);
        return false;
    } finally {
        console.log('[removeTrackFromPlaylist] 処理終了');
    }
};
