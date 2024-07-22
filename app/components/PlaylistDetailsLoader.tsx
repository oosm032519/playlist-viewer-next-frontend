// app/components/PlaylistDetailsLoader.tsx

"use client";

import {useQuery} from '@tanstack/react-query';
import {Track} from "../types/track";
import PlaylistDetails from "./PlaylistDetails";
import LoadingSpinner from "./LoadingSpinner";
import {AudioFeatures} from '../types/audioFeaturesTypes';

interface PlaylistDetailsLoaderProps {
    playlistId: string;
    userId?: string;
}

interface PlaylistData {
    tracks: Track[];
    genreCounts: { [genre: string]: number };
    recommendations: Track[];
    playlistName: string | null;
    ownerId: string;
    totalDuration: number;
    averageAudioFeatures: AudioFeatures;
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
            totalDuration: data.totalDuration || 0,
            averageAudioFeatures: data.averageAudioFeatures || {},
        };
    }
    throw new Error('Invalid response data');
};

const formatDuration = (millis: number): string => {
    const hours = Math.floor(millis / (1000 * 60 * 60));
    const minutes = Math.floor((millis % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((millis % (1000 * 60)) / 1000);
    
    if (hours > 0) {
        return `${hours}時間${minutes}分${seconds}秒`;
    } else {
        return `${minutes}分${seconds}秒`;
    }
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
    
    const formattedDuration = formatDuration(playlistData.totalDuration);
    
    return (
        <PlaylistDetails
            tracks={playlistData.tracks}
            genreCounts={playlistData.genreCounts}
            recommendations={playlistData.recommendations}
            playlistName={playlistData.playlistName}
            ownerId={playlistData.ownerId}
            userId={userId || ''}
            playlistId={playlistId}
            totalDuration={formattedDuration}
            averageAudioFeatures={playlistData.averageAudioFeatures}
            totalTracks={playlistData.tracks.length}
        />
    );
};

export default PlaylistDetailsLoader;
