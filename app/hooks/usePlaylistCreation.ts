// app/hooks/usePlaylistCreation.ts
import {useMutation} from '@tanstack/react-query';
import {useToast} from "@/app/components/ui/use-toast";

export const usePlaylistCreation = () => {
    const {toast} = useToast();
    
    const createPlaylistMutation = useMutation({
        mutationFn: async ({trackIds, playlistName}: { trackIds: string[], playlistName?: string }) => {
            const response = await fetch('/api/playlists/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({trackIds, playlistName}), // プレイリスト名も送信
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
    
    const createSortedPlaylist = async (trackIds: string[], playlistName?: string) => {
        createPlaylistMutation.mutate({trackIds, playlistName});
    };
    
    return {createSortedPlaylist};
};
