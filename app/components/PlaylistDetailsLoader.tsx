// app/components/PlaylistDetailsLoader.tsx
"use client";

import {useState, useEffect} from "react";
import axios from "axios";
import {Track} from "@/app/types/track";
import PlaylistDetails from "@/app/components/PlaylistDetails";
import LoadingSpinner from "./LoadingSpinner";

interface PlaylistDetailsLoaderProps {
    playlistId: string;
    userId: string; // userId を props として受け取る
}

const PlaylistDetailsLoader: React.FC<PlaylistDetailsLoaderProps> = ({
                                                                         playlistId,
                                                                         userId, // userId を props から受け取る
                                                                     }) => {
    const [playlistData, setPlaylistData] = useState<{
        tracks: Track[];
        genreCounts: { [genre: string]: number };
        recommendations: Track[];
        playlistName: string | null;
        ownerId: string; // ownerId を追加
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchPlaylistDetails = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/playlists/${playlistId}`);
                const tracks = response.data.tracks.items.map((item: any) => ({
                    ...item.track,
                    audioFeatures: item.audioFeatures,
                }));
                setPlaylistData({
                    tracks: tracks,
                    genreCounts: response.data.genreCounts,
                    recommendations: response.data.recommendations,
                    playlistName: response.data.playlistName,
                    ownerId: response.data.ownerId, // ownerId を設定
                });
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
    
    if (!playlistData) {
        return <div>プレイリストが見つかりませんでした。</div>;
    }
    
    return (
        <PlaylistDetails
            tracks={playlistData.tracks}
            genreCounts={playlistData.genreCounts}
            recommendations={playlistData.recommendations}
            playlistName={playlistData.playlistName}
            ownerId={playlistData.ownerId} // ownerId を PlaylistDetails に渡す
            userId={userId} // userId を PlaylistDetails に渡す
            playlistId={playlistId} // playlistId を PlaylistDetails に渡す
        />
    );
};

export default PlaylistDetailsLoader;
