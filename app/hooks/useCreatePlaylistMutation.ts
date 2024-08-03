import {useMutation} from '@tanstack/react-query';
import {useState} from "react";

export const useCreatePlaylistMutation = (tracks: any[], toast: any) => {
    const [createdPlaylistId, setCreatedPlaylistId] = useState<string | null>(null);
    
    const createPlaylistMutation = useMutation({
        mutationFn: async (trackIds: string[]) => {
            // セッションストレージからJWTを取得
            const jwt = localStorage.getItem('JWT');
            const response = await fetch('/api/playlists/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`, // JWTをAuthorizationヘッダーに設定
                },
                body: JSON.stringify(trackIds),
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
        onError: (error) => {
            console.error("プレイリストの作成中にエラーが発生しました。", error);
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
    
    return {createPlaylist, createdPlaylistId, isCreating: createPlaylistMutation.isPending};
};
