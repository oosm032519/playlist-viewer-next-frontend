// app/page.tsx
"use client";

import {useState} from "react";
import {Card, CardHeader, CardTitle, CardContent} from "./components/ui/card";
import PlaylistSearchForm from "./components/PlaylistSearchForm";
import PlaylistIdForm from "./components/PlaylistIdForm";
import LoginButton from "./components/LoginButton";
import {useUser, UserContextProvider} from "./context/UserContext"; // UserContextProviderをインポート
import ErrorAlert from "./components/ErrorAlert";
import PlaylistDisplay from "./components/PlaylistDisplay";
import {Playlist} from "./types/playlist";

export default function Home() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
    const {isLoggedIn, userId, error} = useUser();
    
    const handleSearch = (playlists: Playlist[]) => {
        setPlaylists(playlists);
        setSelectedPlaylistId(null);
    };
    
    const handlePlaylistClick = async (playlistId: string): Promise<void> => {
        setSelectedPlaylistId(playlistId);
    };
    
    return (
        <UserContextProvider> {/* UserContextProviderでラップ */}
            <main className="flex flex-col items-center justify-center p-8">
                <Card className="w-full max-w-4xl">
                    <CardHeader>
                        <CardTitle className="text-4xl font-bold text-center text-spotify-green">
                            Playlist Viewer
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <LoginButton/> {/* isLoggedInを渡す必要はありません */}
                            <PlaylistIdForm onPlaylistSelect={handlePlaylistClick}/>
                            <PlaylistSearchForm onSearch={handleSearch}/>
                            {error && <ErrorAlert error={error}/>}
                            <PlaylistDisplay
                                playlists={playlists}
                                selectedPlaylistId={selectedPlaylistId}
                                userId={userId || undefined}
                                onPlaylistClick={handlePlaylistClick}
                            /> {/* isLoggedInを渡す必要はありません */}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </UserContextProvider>
    );
}
