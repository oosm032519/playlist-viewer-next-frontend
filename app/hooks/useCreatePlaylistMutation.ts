// app/hooks/useCreatePlaylistMutation.ts

import {useMutation} from '@tanstack/react-query';
import {useState} from 'react';

/**
 * プレイリスト作成のためのカスタムフック。
 * @param tracks プレイリストに含めるトラックの配列。
 * @param toast 通知を表示するための関数。
 * @returns プレイリスト作成関数、作成されたプレイリストのID、作成中の状態を返す。
 */
export const useCreatePlaylistMutation = (tracks: any[], toast: any) => {
    // 作成されたプレイリストのIDを保持するための状態
    const [createdPlaylistId, setCreatedPlaylistId] = useState<string | null>(null);
    
    // プレイリスト作成のためのミューテーション
    const createPlaylistMutation = useMutation({
        /**
         * プレイリストを作成する非同期関数。
         * @param trackIds プレイリストに含めるトラックのID配列。
         * @returns 作成されたプレイリストのIDを返す。
         * @throws プレイリスト作成中にエラーが発生した場合。
         */
        mutationFn: async (trackIds: string[]) => {
            const response = await fetch('/api/playlists/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trackIds),
                credentials: 'include', // Cookieを含める
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`プレイリストの作成中にエラーが発生しました: ${errorData.details}`);
            }
            
            const data = await response.json();
            return data.playlistId;
        },
        /**
         * プレイリスト作成成功時のコールバック。
         * @param data 作成されたプレイリストのID。
         */
        onSuccess: (data: string) => {
            setCreatedPlaylistId(data);
            toast({
                title: "プレイリスト作成成功",
                description: "新しいプレイリストが正常に作成されました。",
            });
        },
        /**
         * プレイリスト作成失敗時のコールバック。
         */
        onError: () => {
            toast({
                title: "エラー",
                description: "プレイリストの作成中にエラーが発生しました。",
                variant: "destructive",
            });
        },
    });
    
    /**
     * プレイリストを作成するための関数。
     */
    const createPlaylist = () => {
        // 各トラックのIDを抽出
        const trackIds = tracks.map(track => track.id as string);
        createPlaylistMutation.mutate(trackIds);
    };
    
    // フックが返すオブジェクト
    return {
        createPlaylist, // プレイリスト作成をトリガーする関数
        createdPlaylistId, // 作成されたプレイリストのID
        isCreating: createPlaylistMutation.isPending // プレイリスト作成中の状態
    };
};
