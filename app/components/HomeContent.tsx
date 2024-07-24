"use client";

import React, {useState} from "react";
import {Card, CardHeader, CardTitle, CardContent} from "../components/ui/card";
import PlaylistSearchForm from "../components/PlaylistSearchForm";
import PlaylistIdForm from "../components/PlaylistIdForm";
import LoginButton from "../components/LoginButton";
import {useUser} from "../context/UserContext";
import {usePlaylist} from "../context/PlaylistContext";
import ErrorAlert from "../components/ErrorAlert";
import PlaylistDisplay from "../components/PlaylistDisplay";
import {Playlist} from "../types/playlist";
import FavoritePlaylistsTable from '../components/FavoritePlaylistsTable'

export default function HomeContent() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const {isLoggedIn, userId, error} = useUser();
    const {setSelectedPlaylistId} = usePlaylist();
    
    const handleSearch = (playlists: Playlist[]) => {
        setPlaylists(playlists);
        setSelectedPlaylistId(null);
    };
    
    const handlePlaylistClick = async (playlistId: string): Promise<void> => {
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
                        <LoginButton/>
                        <PlaylistIdForm onPlaylistSelect={handlePlaylistClick}/>
                        <PlaylistSearchForm onSearch={handleSearch}/>
                        {error && <ErrorAlert error={error}/>}
                        <PlaylistDisplay
                            playlists={playlists}
                            userId={userId || undefined}
                            onPlaylistClick={handlePlaylistClick}
                        />
                    </div>
                    {isLoggedIn && <FavoritePlaylistsTable/>}
                </CardContent>
            </Card>
        </main>
    );
}
