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
    const [createdPlaylistId, setCreatedPlaylistId] = useState<string | null>(null);
    const createPlaylistMutation = useMutation({
        mutationFn: async (trackIds: string[]) => {
            // CreatePlaylistRequest オブジェクトを作成
            const requestBody = {
                trackIds: trackIds,
                // RecommendationsTable では playlistName は不要なので undefined
            };
            
            const response = await fetch('/api/playlists/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody), // オブジェクトを送信
                credentials: 'include',
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`プレイリストの作成中にエラーが発生しました: ${errorData.details}`);
            }
            
            const data = await response.json();
            return data.playlistId;
        },
        onSuccess: (data: string) => {
            setCreatedPlaylistId(data);
            toast({
                title: "プレイリスト作成成功",
                description: "新しいプレイリストが正常に作成されました。",
            });
        },
        onError: () => {
            toast({
                title: "エラー",
                description: "プレイリストの作成中にエラーが発生しました。",
                variant: "destructive",
            });
        },
    });
    
    const createPlaylist = () => {
        const trackIds = tracks.map(track => track.id as string);
        createPlaylistMutation.mutate(trackIds);
    };
    
    return {
        createPlaylist,
        createdPlaylistId,
        isCreating: createPlaylistMutation.isPending
    };
};
