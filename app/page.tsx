"use client";

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
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {checkSession} from "./lib/checkSession"; // セッションチェック関数をインポート

export default function Home() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null); // userId を状態として保持
    
    const queryClient = new QueryClient();
    
    useEffect(() => {
        const initializeSession = async () => {
            const sessionStatus = await checkSession();
            setIsLoggedIn(sessionStatus);
            
            if (sessionStatus) {
                try {
                    const response = await fetch("http://localhost:8080/api/session/check", {
                        credentials: "include",
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    if (data.userId) {
                        setUserId(data.userId); // userId を状態に設定
                    }
                } catch (error) {
                    if (error instanceof Error) {
                        console.error("ユーザーIDの取得中にエラーが発生しました:", error.message, (error as any).code);
                        setError("ユーザーIDの取得中にエラーが発生しました。");
                    } else {
                        console.error("ユーザーIDの取得中にエラーが発生しました:", error);
                        setError("ユーザーIDの取得中にエラーが発生しました。");
                    }
                }
            }
        };
        initializeSession();
    }, []);
    
    const handleSearch = (playlists: Playlist[]) => {
        setPlaylists(playlists);
        setError(null);
        setSelectedPlaylistId(null);
    };
    
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };
    
    const handlePlaylistClick = async (playlistId: string): Promise<void> => {
        setSelectedPlaylistId(playlistId);
    };
    
    return (
        <QueryClientProvider client={queryClient}>
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
                            
                            {playlists.length > 0 && !selectedPlaylistId && (
                                <PlaylistTable playlists={playlists} onPlaylistClick={handlePlaylistClick}/>
                            )}
                            
                            {selectedPlaylistId && userId && (
                                <PlaylistDetailsLoader playlistId={selectedPlaylistId} userId={userId}/>
                            )}
                            
                            {isLoggedIn && <FollowedPlaylists onPlaylistClick={handlePlaylistClick}/>}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </QueryClientProvider>
    );
}
