// app/page.tsx
"use client";

import {useState, useEffect} from "react";
import PlaylistSearchForm from "./components/PlaylistSearchForm";
import PlaylistTable from "./components/PlaylistTable";
import {Playlist} from "@/app/types/playlist";
import {Alert, AlertDescription, AlertTitle} from "./components/ui/alert";
import PlaylistIdForm from "./components/PlaylistIdForm";
import LoginButton from "./components/LoginButton";
import FollowedPlaylists from "./components/FollowedPlaylists";
import {Card, CardHeader, CardTitle, CardContent} from "./components/ui/card";
import PlaylistDetailsLoader from "./components/PlaylistDetailsLoader"; // インポート

export default function Home() {
    console.log("Home コンポーネントがレンダリングされました");
    
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [, setUserId] = useState<string | null>(null);
    const [sessionCheckResult] = useState('');
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null); // Homeコンポーネントで管理
    
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/session/check', {
                    credentials: 'include'
                });
                // レスポンスをJSONとしてパース
                const data = await response.json();
                if (data.status === 'success') {
                    setIsLoggedIn(true);
                    setUserId(data.userId);
                }
            } catch (error) {
                console.error('セッションチェックエラー:', error);
            }
        };
        
        checkSession();
    }, []);
    
    const handleSearch = (playlists: Playlist[]) => {
        console.log("handleSearch 関数が呼び出されました");
        console.log("受け取った playlists:", playlists);
        
        setPlaylists(playlists);
        console.log("playlists の状態を更新しました");
        setError(null);
        console.log("error の状態をクリアしました");
        setSelectedPlaylistId(null); // プレイリスト検索時は詳細を非表示にする
    };
    
    const handleLoginSuccess = () => {
        console.log("handleLoginSuccess 関数が呼び出されました");
        setIsLoggedIn(true);
        console.log("isLoggedIn の状態を true に更新しました");
    };
    
    const handlePlaylistClick = (playlistId: string) => {
        console.log("Playlist clicked:", playlistId);
        setSelectedPlaylistId(playlistId);
    };
    
    console.log("Home: JSX をレンダリングします");
    
    return (
        <main className="flex flex-col items-center justify-center p-8">
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle className="text-4xl font-bold text-center text-spotify-green">
                        Playlist Viewer
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <LoginButton onLoginSuccess={handleLoginSuccess}/>
                        <PlaylistSearchForm onSearch={handleSearch}/>
                        <PlaylistIdForm onPlaylistSelect={handlePlaylistClick}/>
                        
                        {error && (
                            <Alert variant="destructive">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        
                        <div className="mt-4">
                            <pre>{sessionCheckResult}</pre>
                        </div>
                        
                        {/* PlaylistTable と PlaylistDetailsLoader を条件付きでレンダリング */}
                        {!selectedPlaylistId && playlists.length > 0 && (
                            <PlaylistTable playlists={playlists} onPlaylistClick={handlePlaylistClick}/>
                        )}
                        
                        {/* 選択されたプレイリストの詳細を表示 */}
                        {selectedPlaylistId && (
                            <PlaylistDetailsLoader playlistId={selectedPlaylistId}/>
                        )}
                        
                        {isLoggedIn && <FollowedPlaylists onPlaylistClick={handlePlaylistClick}/>}
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
