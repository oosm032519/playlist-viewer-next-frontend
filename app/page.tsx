"use client";

import {useState} from "react";
import PlaylistSearchForm from "./components/PlaylistSearchForm";
import PlaylistTable from "./components/PlaylistTable";
import {Playlist} from "@/types/playlist";

export default function Home() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    
    const handleSearch = (playlists: Playlist[]) => {
        setPlaylists(playlists);
    };
    
    return (
        <main className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-8 text-spotify-green">
                Playlist Viewer
            </h1>
            <PlaylistSearchForm onSearch={handleSearch}/>
            {playlists.length > 0 && <PlaylistTable playlists={playlists}/>}
        </main>
    );
}
