// app/components/PlaylistDetailsLoader.tsx
"use client";

import {useState, useEffect} from "react";
import axios from 'axios';
import {Track} from "@/app/types/track";
import PlaylistDetails from "@/app/components/PlaylistDetails";
import LoadingSpinner from "./LoadingSpinner";

interface PlaylistDetailsLoaderProps {
    playlistId: string;
}

const PlaylistDetailsLoader: React.FC<PlaylistDetailsLoaderProps> = ({playlistId}) => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [genreCounts, setGenreCounts] = useState<{ [genre: string]: number }>({});
    const [recommendations, setRecommendations] = useState<Track[]>([]);
    const [playlistName, setPlaylistName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchPlaylistDetails = async () => {
            try {
                const response = await axios.get(`/api/playlists/${playlistId}`);
                setTracks(response.data.tracks.items.map((item: any) => ({
                    ...item.track,
                    audioFeatures: item.audioFeatures
                })));
                setGenreCounts(response.data.genreCounts);
                setRecommendations(response.data.recommendations);
                setPlaylistName(response.data.playlistName);
            } catch (error) {
                console.error("Error fetching playlist details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchPlaylistDetails();
    }, [playlistId]);
    
    if (isLoading) {
        return <LoadingSpinner loading={isLoading}/>;
    }
    
    return (
        <PlaylistDetails
            tracks={tracks}
            genreCounts={genreCounts}
            recommendations={recommendations}
            playlistName={playlistName}
        />
    );
};

export default PlaylistDetailsLoader;
