// app/page.tsx
"use client";

import {useState} from "react";
import {Card, CardHeader, CardTitle, CardContent} from "./components/ui/card";
import PlaylistSearchForm from "./components/PlaylistSearchForm";
import PlaylistIdForm from "./components/PlaylistIdForm";
import LoginButton from "./components/LoginButton";
import {useUser, UserContextProvider} from "./context/UserContext";
import ErrorAlert from "./components/ErrorAlert";
import PlaylistDisplay from "./components/PlaylistDisplay";
import {Playlist} from "./types/playlist";

/**
 * Homeコンポーネント
 * ユーザーがプレイリストを検索し、選択できるメインページ
 */
export default function Home() {
    // プレイリストの状態を管理
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    // 選択されたプレイリストIDの状態を管理
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
    // ユーザーのログイン状態、ユーザーID、エラー情報を取得
    const {isLoggedIn, userId, error} = useUser();
    
    /**
     * プレイリスト検索結果を処理する関数
     * @param playlists - 検索結果のプレイリスト配列
     */
    const handleSearch = (playlists: Playlist[]) => {
        setPlaylists(playlists);
        setSelectedPlaylistId(null);
    };
    
    /**
     * プレイリストがクリックされたときに呼ばれる関数
     * @param playlistId - クリックされたプレイリストのID
     */
    const handlePlaylistClick = async (playlistId: string): Promise<void> => {
        setSelectedPlaylistId(playlistId);
    };
    
    return (
        // UserContextProviderで全体をラップし、ユーザーコンテキストを提供
        <UserContextProvider>
            <main className="flex flex-col items-center justify-center p-8">
                <Card className="w-full max-w-4xl">
                    <CardHeader>
                        <CardTitle className="text-4xl font-bold text-center text-spotify-green">
                            Playlist Viewer
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* ログインボタン */}
                            <LoginButton/>
                            {/* プレイリストIDフォーム */}
                            <PlaylistIdForm onPlaylistSelect={handlePlaylistClick}/>
                            {/* プレイリスト検索フォーム */}
                            <PlaylistSearchForm onSearch={handleSearch}/>
                            {/* エラーがある場合はエラーアラートを表示 */}
                            {error && <ErrorAlert error={error}/>}
                            {/* プレイリスト表示コンポーネント */}
                            <PlaylistDisplay
                                playlists={playlists}
                                selectedPlaylistId={selectedPlaylistId}
                                userId={userId || undefined}
                                onPlaylistClick={handlePlaylistClick}
                            />
                        </div>
                    </CardContent>
                </Card>
            </main>
        </UserContextProvider>
    );
}
