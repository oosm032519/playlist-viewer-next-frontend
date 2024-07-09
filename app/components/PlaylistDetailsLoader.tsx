// app/components/PlaylistDetailsLoader.tsx
"use client";

import {useQuery} from '@tanstack/react-query';
import {Track} from "../types/track";
import PlaylistDetails from "./PlaylistDetails";
import LoadingSpinner from "./LoadingSpinner";

interface PlaylistDetailsLoaderProps {
    playlistId: string;
    userId?: string; // userIdをオプションのプロパティにする
}

interface PlaylistData {
    tracks: Track[];
    genreCounts: { [genre: string]: number };
    recommendations: Track[];
    playlistName: string | null;
    ownerId: string;
}

const fetchPlaylistDetails = async (playlistId: string): Promise<PlaylistData> => {
    const response = await fetch(`/api/playlists/${playlistId}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (data) {
        console.log(data);
        const tracks = data.tracks?.items?.map((item: any) => ({
            ...item.track,
            audioFeatures: item.audioFeatures,
        })) || [];
        return {
            tracks: tracks,
            genreCounts: data.genreCounts || {},
            recommendations: data.recommendations || [],
            playlistName: data.playlistName || null,
            ownerId: data.ownerId || '',
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
        return <div>プレイリスト取得中にエラーが発生しました</div>;
    }
    
    return (
        <PlaylistDetails
            tracks={playlistData.tracks}
            genreCounts={playlistData.genreCounts}
            recommendations={playlistData.recommendations}
            playlistName={playlistData.playlistName}
            ownerId={playlistData.ownerId}
            userId={userId || ''}
            playlistId={playlistId}
        />
    );
};

export default PlaylistDetailsLoader;
