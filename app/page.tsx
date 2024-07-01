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
import PlaylistDetailsLoader from "./components/PlaylistDetailsLoader";

export default function Home() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
    
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/session/check', {
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.status === 'success') {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.error('セッションチェックエラー:', error);
            }
        };
        
        checkSession();
    }, []);
    
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
                        
                        {!selectedPlaylistId && playlists.length > 0 && (
                            <PlaylistTable playlists={playlists} onPlaylistClick={handlePlaylistClick}/>
                        )}
                        
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
