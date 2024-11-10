// app/components/PlaylistIdForm.tsx

"use client";

import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {Button} from "@/app/components/ui/button";
import {Input} from "@/app/components/ui/input";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import {Alert, AlertDescription, AlertTitle} from "@/app/components/ui/alert";

interface PlaylistIdFormProps {
    /** プレイリストが選択されたときに呼び出されるコールバック関数 */
    onPlaylistSelect: (playlistId: string) => Promise<void>;
}

/**
 * URLからプレイリストIDを抽出する関数
 * @param {string} url - プレイリストのURL
 * @returns {string | null} - 抽出されたプレイリストID、またはnull
 */
const extractPlaylistIdFromUrl = (url: string): string | null => {
    const regex = /\/playlist\/([^?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

/**
 * プレイリストIDを入力し、選択するためのフォームコンポーネント
 * @param {PlaylistIdFormProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} - プレイリストIDフォームのJSX要素
 */
const PlaylistIdForm = ({onPlaylistSelect}: PlaylistIdFormProps): JSX.Element => {
    // プレイリストIDの状態管理
    const [playlistId, setPlaylistId] = useState("");
    // エラーメッセージの状態管理
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    // プレイリストID送信のためのMutation設定
    const mutation = useMutation({
        mutationFn: (extractedId: string) => onPlaylistSelect(extractedId),
        onError: (error) => {
            setErrorMessage("プレイリストの取得中にエラーが発生しました");
        },
    });
    
    /**
     * フォーム送信時のハンドラー
     * @param {React.FormEvent} event - フォームイベント
     */
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        // URLからプレイリストIDを抽出
        const extractedId = extractPlaylistIdFromUrl(playlistId);
        
        if (!extractedId) {
            setErrorMessage("無効なプレイリストURLです");
            return;
        }
        
        setErrorMessage(null); // エラーメッセージをクリア
        mutation.mutate(extractedId);
    };
    
    return (
        <>
            {/* エラーメッセージ表示領域 */}
            {errorMessage && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}
            
            {/* プレイリストURL入力フォーム */}
            <form onSubmit={handleSubmit} className="flex space-x-2">
                <Input
                    type="text"
                    placeholder="Enter playlist URL"
                    value={playlistId}
                    onChange={(e) => setPlaylistId(e.target.value)}
                    disabled={mutation.isPending}/>
                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Submitting...' : 'Submit'}
                </Button>
            </form>
            
            {/* ローディングスピナー */}
            <LoadingSpinner loading={mutation.isPending}/>
        </>
    );
};

export default PlaylistIdForm;
