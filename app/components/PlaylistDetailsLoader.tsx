// app/components/PlaylistDetailsLoader.tsx
"use client";

import {useQuery} from '@tanstack/react-query';
import axios from "axios";
import {Track} from "@/app/types/track";
import PlaylistDetails from "@/app/components/PlaylistDetails";
import LoadingSpinner from "./LoadingSpinner";

interface PlaylistDetailsLoaderProps {
    playlistId: string;
    userId: string;
}

interface PlaylistData {
    tracks: Track[];
    genreCounts: { [genre: string]: number };
    recommendations: Track[];
    playlistName: string | null;
    ownerId: string;
}

const fetchPlaylistDetails = async (playlistId: string): Promise<PlaylistData> => {
    const response = await axios.get(`/api/playlists/${playlistId}`);
    if (response && response.data) {
        const tracks = response.data.tracks?.items?.map((item: any) => ({
            ...item.track,
            audioFeatures: item.audioFeatures,
        })) || [];
        return {
            tracks: tracks,
            genreCounts: response.data.genreCounts || {},
            recommendations: response.data.recommendations || [],
            playlistName: response.data.playlistName || null,
            ownerId: response.data.ownerId || '',
        };
    }
    throw new Error('Invalid response data');
};

const PlaylistDetailsLoader: React.FC<PlaylistDetailsLoaderProps> = ({
                                                                         playlistId,
                                                                         userId,
                                                                     }) => {
    const {data: playlistData, isLoading, error} = useQuery<PlaylistData, Error>({
        queryKey: ['playlistDetails', playlistId],
        queryFn: () => fetchPlaylistDetails(playlistId),
    });
    
    if (isLoading) {
        return <LoadingSpinner loading={isLoading}/>;
    }
    
    if (error || !playlistData) {
        return <div>プレイリストが見つかりませんでした。</div>;
    }
    
    return (
        <PlaylistDetails
            tracks={playlistData.tracks}
            genreCounts={playlistData.genreCounts}
            recommendations={playlistData.recommendations}
            playlistName={playlistData.playlistName}
            ownerId={playlistData.ownerId}
            userId={userId}
            playlistId={playlistId}
        />
    );
};

export default PlaylistDetailsLoader;
