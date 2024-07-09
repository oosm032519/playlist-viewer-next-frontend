// app/page.tsx

"use client";

import {useState} from "react";
import {Card, CardHeader, CardTitle, CardContent} from "./components/ui/card";
import PlaylistSearchForm from "./components/PlaylistSearchForm";
import PlaylistIdForm from "./components/PlaylistIdForm";
import LoginButton from "./components/LoginButton";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useSession} from "./hooks/useSession";
import ErrorAlert from "./components/ErrorAlert";
import PlaylistDisplay from "./components/PlaylistDisplay";
import {Playlist} from "./types/playlist";

export default function Home() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
    const queryClient = new QueryClient();
    const {isLoggedIn, userId, error} = useSession(); // useSessionからisLoggedInを取得
    
    const handleSearch = (playlists: Playlist[]) => {
        setPlaylists(playlists);
        setSelectedPlaylistId(null);
    };
    
    // handleLoginSuccessは不要になる
    
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
                            {/* LoginButtonにisLoggedInを渡す */}
                            <LoginButton isLoggedIn={isLoggedIn}/>
                            <PlaylistIdForm onPlaylistSelect={handlePlaylistClick}/>
                            <PlaylistSearchForm onSearch={handleSearch}/>
                            {error && <ErrorAlert error={error}/>}
                            <PlaylistDisplay
                                playlists={playlists}
                                selectedPlaylistId={selectedPlaylistId}
                                userId={userId || undefined}
                                onPlaylistClick={handlePlaylistClick}
                                isLoggedIn={isLoggedIn}
                            />
                        </div>
                    </CardContent>
                </Card>
            </main>
        </QueryClientProvider>
    );
}
