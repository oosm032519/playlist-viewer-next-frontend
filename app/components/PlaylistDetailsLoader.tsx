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
    const [playlistData, setPlaylistData] = useState<{
        tracks: Track[];
        genreCounts: { [genre: string]: number };
        recommendations: Track[];
        playlistName: string | null;
        ownerId: string | null;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchPlaylistDetails = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/playlists/${playlistId}`);
                const tracks = response.data.tracks.items.map((item: any) => ({
                    ...item.track,
                    audioFeatures: item.audioFeatures
                }));
                setPlaylistData({
                    tracks: tracks,
                    genreCounts: response.data.genreCounts,
                    recommendations: response.data.recommendations,
                    playlistName: response.data.playlistName,
                    ownerId: response.data.ownerId,
                });
            } catch (error) {
                console.error("Error fetching playlist details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        const fetchUserId = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/session/check', {withCredentials: true});
                if (response.data.status === 'success') {
                    setUserId(response.data.userId);
                }
            } catch (error) {
                console.error('セッションチェックエラー:', error);
            }
        };
        
        fetchPlaylistDetails();
        fetchUserId();
    }, [playlistId]);
    
    if (isLoading) {
        return <LoadingSpinner loading={isLoading}/>;
    }
    
    if (!playlistData) {
        return <div>プレイリストが見つかりませんでした。</div>;
    }
    
    return (
        <PlaylistDetails
            tracks={playlistData.tracks}
            genreCounts={playlistData.genreCounts}
            recommendations={playlistData.recommendations}
            playlistName={playlistData.playlistName}
            ownerId={playlistData.ownerId}
            userId={userId} // userId を PlaylistDetails に渡す
        />
    );
};

export default PlaylistDetailsLoader;
