import {useState} from "react";
import {addTrackToPlaylist, removeTrackFromPlaylist} from "../lib/trackUtils";

export const useTrackActions = (playlistId: string, toast: any) => {
    const [addedTracks, setAddedTracks] = useState<Set<string>>(new Set());
    
    const handleAddTrack = async (trackId: string) => {
        try {
            await addTrackToPlaylist(playlistId, trackId);
            setAddedTracks(prev => new Set(prev).add(trackId));
            toast({
                title: "楽曲追加",
                description: "プレイリストに楽曲を追加しました。",
            });
        } catch (error) {
            console.error("楽曲の追加中にエラーが発生しました。", error);
            toast({
                title: "エラー",
                description: "楽曲の追加中にエラーが発生しました。",
                variant: "destructive",
            });
        }
    };
    
    const handleRemoveTrack = async (trackId: string) => {
        try {
            await removeTrackFromPlaylist(playlistId, trackId);
            setAddedTracks(prev => {
                const newSet = new Set(prev);
                newSet.delete(trackId);
                return newSet;
            });
            toast({
                title: "楽曲削除",
                description: "プレイリストから楽曲を削除しました。",
            });
        } catch (error) {
            console.error("楽曲の削除中にエラーが発生しました。", error);
            toast({
                title: "エラー",
                description: "楽曲の削除中にエラーが発生しました。",
                variant: "destructive",
            });
        }
    };
    
    return {addedTracks, handleAddTrack, handleRemoveTrack};
};
