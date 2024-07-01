// app/page.tsx
"use client";

import {useState, useEffect} from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "./components/ui/card";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "./components/ui/alert";
import PlaylistSearchForm from "./components/PlaylistSearchForm";
import PlaylistIdForm from "./components/PlaylistIdForm";
import LoginButton from "./components/LoginButton";
import FollowedPlaylists from "./components/FollowedPlaylists";
import PlaylistTable from "./components/PlaylistTable";
import PlaylistDetailsLoader from "./components/PlaylistDetailsLoader";
import {Playlist} from "@/app/types/playlist";

// セッションチェック処理を関数として抽出
const checkSession = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/session/check', {
            credentials: 'include'
        });
        const data = await response.json();
        return data.status === 'success';
    } catch (error) {
        console.error('セッションチェックエラー:', error);
        return false;
    }
};

export default function Home() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null); // userId を状態として保持
    
    useEffect(() => {
        const initializeSession = async () => {
            setIsLoggedIn(await checkSession());
            
            // セッションチェックが成功したらuserIdを取得
            if (isLoggedIn) {
                try {
                    const response = await fetch("http://localhost:8080/api/session/check", {
                        credentials: "include",
                    });
                    const data = await response.json();
                    if (data.userId) {
                        setUserId(data.userId); // userId を状態に設定
                    }
                } catch (error) {
                    console.error("ユーザーIDの取得中にエラーが発生しました:", error);
                }
            }
        };
        initializeSession();
    }, [isLoggedIn]);
    
    const handleSearch = (playlists: Playlist[]) => {
        setPlaylists(playlists);
        setError(null);
        setSelectedPlaylistId(null);
    };
    
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };
    
    const handlePlaylistClick = (playlistId: string) => {
        setSelectedPlaylistId(playlistId);
    };
    
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
                        
                        {/* 条件式を整理 */}
                        {playlists.length > 0 && !selectedPlaylistId && (
                            <PlaylistTable playlists={playlists} onPlaylistClick={handlePlaylistClick}/>
                        )}
                        
                        {selectedPlaylistId && (
                            <PlaylistDetailsLoader playlistId={selectedPlaylistId} userId={userId}/> // userId を渡す
                        )}
                        
                        {isLoggedIn && <FollowedPlaylists onPlaylistClick={handlePlaylistClick}/>}
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
