import {useState} from "react";
import {addTrackToPlaylist, removeTrackFromPlaylist} from "../lib/trackUtils";

/**
 * プレイリストにトラックを追加または削除するためのカスタムフック。
 *
 * @param playlistId - 操作対象のプレイリストのID
 * @param toast - ユーザーに通知を表示するための関数
 * @returns プレイリストに追加されたトラックのセットと、トラックを追加・削除するための関数
 */
export const useTrackActions = (playlistId: string, toast: any) => {
    // プレイリストに追加されたトラックのIDを保持するSet
    const [addedTracks, setAddedTracks] = useState<Set<string>>(new Set());
    
    /**
     * 指定されたトラックIDをプレイリストに追加する。
     *
     * @param trackId - 追加するトラックのID
     */
    const handleAddTrack = async (trackId: string) => {
        try {
            // プレイリストにトラックを追加する非同期処理
            await addTrackToPlaylist(playlistId, trackId);
            // 追加されたトラックIDをセットに追加
            setAddedTracks(prev => new Set(prev).add(trackId));
            // 成功したことをユーザーに通知
            toast({
                title: "楽曲追加",
                description: "プレイリストに楽曲を追加しました。",
            });
        } catch (error) {
            // エラーが発生した場合の処理
            console.error("楽曲の追加中にエラーが発生しました。", error);
            toast({
                title: "エラー",
                description: "楽曲の追加中にエラーが発生しました。",
                variant: "destructive",
            });
        }
    };
    
    /**
     * 指定されたトラックIDをプレイリストから削除する。
     *
     * @param trackId - 削除するトラックのID
     */
    const handleRemoveTrack = async (trackId: string) => {
        try {
            // プレイリストからトラックを削除する非同期処理
            await removeTrackFromPlaylist(playlistId, trackId);
            // 削除されたトラックIDをセットから削除
            setAddedTracks(prev => {
                const newSet = new Set(prev);
                newSet.delete(trackId);
                return newSet;
            });
            // 成功したことをユーザーに通知
            toast({
                title: "楽曲削除",
                description: "プレイリストから楽曲を削除しました。",
            });
        } catch (error) {
            // エラーが発生した場合の処理
            console.error("楽曲の削除中にエラーが発生しました。", error);
            toast({
                title: "エラー",
                description: "楽曲の削除中にエラーが発生しました。",
                variant: "destructive",
            });
        }
    };
    
    // フックが提供する値と関数を返す
    return {addedTracks, handleAddTrack, handleRemoveTrack};
};
