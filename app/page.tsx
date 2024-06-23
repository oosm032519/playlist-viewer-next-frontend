"use client";

import {useState} from "react";
import PlaylistSearchForm from "./components/PlaylistSearchForm";
import PlaylistTable from "./components/PlaylistTable";
import {Playlist} from "@/app/types/playlist";
import {Alert, AlertDescription, AlertTitle} from "./components/ui/alert";

export default function Home() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    const handleSearch = (playlists: Playlist[]) => {
        setPlaylists(playlists);
        setError(null); // 検索成功時にエラーをクリア
    };
    
    return (
        <main className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-8 text-spotify-green">
                Playlist Viewer
            </h1>
            <PlaylistSearchForm onSearch={handleSearch}/>
            
            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            
            {playlists.length > 0 && <PlaylistTable playlists={playlists}/>}
        </main>
    );
}
