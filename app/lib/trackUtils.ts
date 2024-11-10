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
 */
export const addTrackToPlaylist = async (playlistId: string, trackId: string): Promise<boolean> => {
    try {
        const response = await fetch("/api/playlists/add-track", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({playlistId, trackId}),
            credentials: 'include',
        });
        
        
        if (response.ok) {
            return true;
        } else {
            await response.text()
            return false;
        }
    } catch (error) {
        return false;
    } finally {
    }
};

/**
 * プレイリストから曲を削除する非同期関数
 *
 * @param {string} playlistId - プレイリストのID
 * @param {string} trackId - 削除する曲のID
 * @returns {Promise<boolean>} - 曲の削除が成功したかどうかを示すブール値
 *
 */
export const removeTrackFromPlaylist = async (playlistId: string, trackId: string): Promise<boolean> => {
    try {
        const response = await fetch("/api/playlists/remove-track", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({playlistId, trackId}),
            credentials: 'include',
        });
        
        
        if (response.ok) {
            return true;
        } else {
            await response.text()
            return false;
        }
    } catch (error) {
        return false;
    } finally {
    }
};
