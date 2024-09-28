// app/hooks/useSearchPlaylists.ts

import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Playlist} from "../types/playlist";

/**
 * プレイリストを検索する非同期関数
 *
 * @param {Object} params - 検索パラメータ
 * @param {string} params.query - 検索クエリ
 * @param {number} params.page - ページ番号
 * @param {number} params.limit - 1ページあたりのアイテム数
 * @returns {Promise<{ playlists: Playlist[], total: number }>} - 検索結果のプレイリスト配列と総数
 * @throws {Error} - ネットワークエラーが発生した場合
 */
const searchPlaylists = async ({
                                   query,
                                   page,
                                   limit,
                               }: {
    query: string;
    page: number;
    limit: number;
}): Promise<{ playlists: Playlist[]; total: number }> => {
    // APIエンドポイントにリクエストを送信
    const response = await fetch(
        `/api/playlists/search?query=${query}&offset=${
            (page - 1) * limit
        }&limit=${limit}`
    );
    
    // レスポンスが正常でない場合、エラーを投げる
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    
    // レスポンスをJSON形式で返す
    const data = await response.json();
    return {playlists: data.playlists, total: data.total};
};

/**
 * プレイリスト検索のカスタムフック
 *
 * @param {Function} onSearch - 検索結果を処理するコールバック関数
 * @returns {Object} - useMutationの戻り値
 */
export const useSearchPlaylists = (
    onSearch: (data: { playlists: Playlist[]; total: number }) => void
) => {
    // React Queryのクライアントを取得
    const queryClient = useQueryClient();
    
    return useMutation({
        // 検索関数をmutationとして設定
        mutationFn: searchPlaylists,
        
        // 成功時の処理
        onSuccess: (data, variables) => {
            // ページごとの結果をキャッシュ
            queryClient.setQueryData(
                ["playlists", variables.query, variables.page],
                data
            );
            
            // 現在のページのデータを取得して onSearch に渡す
            onSearch(data);
        },
        
        // エラー時の処理
        onError: (error: any) => {
            console.error("プレイリスト検索中にエラーが発生しました:", error);
        },
    });
};
