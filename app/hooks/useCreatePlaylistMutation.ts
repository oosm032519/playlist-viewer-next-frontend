// app/hooks/useCreatePlaylistMutation.ts
import {useMutation} from '@tanstack/react-query';

/**
 * プレイリスト作成のためのカスタムフック。
 * @param toast 通知を表示するための関数。
 * @returns プレイリスト作成関数と作成中の状態を返す。
 */
export const useCreatePlaylistMutation = (toast: any) => {
    const createPlaylistMutation = useMutation({
        mutationFn: async ({trackIds, playlistName}: { trackIds: string[], playlistName?: string }) => {
            const response = await fetch('/api/playlists/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({trackIds, playlistName}),
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
            toast({
                title: "プレイリスト作成成功",
                description: "新しいプレイリストが正常に作成されました。",
            });
            window.open(`https://open.spotify.com/playlist/${data}`, '_blank');
        },
        onError: () => {
            toast({
                title: "エラー",
                description: "プレイリストの作成中にエラーが発生しました。",
                variant: "destructive",
            });
        },
    });
    
    /**
     * プレイリストを作成する関数。
     * @param trackIds プレイリストに含めるトラックIDの配列。
     * @param playlistName プレイリストの名前（オプション）。
     */
    const createPlaylist = async (trackIds: string[], playlistName?: string) => {
        createPlaylistMutation.mutate({trackIds, playlistName});
    };
    
    return {
        createPlaylist,
        isCreating: createPlaylistMutation.isPending
    };
};
