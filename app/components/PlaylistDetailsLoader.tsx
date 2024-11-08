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

interface PlaylistDetailsData {
    seedArtists: string[];
    tracks: Track[];
    genreCounts: { [genre: string]: number };
    playlistName: string | null;
    ownerId: string;
    totalDuration: number;
    averageAudioFeatures: AudioFeatures;
    ownerName: string;
    maxAudioFeatures: { [key: string]: number };
    minAudioFeatures: { [key: string]: number };
}

interface RecommendationRequest {
    seedArtists: string[];
    maxAudioFeatures: { [key: string]: number };
    minAudioFeatures: { [key: string]: number };
}

const fetchPlaylistDetails = async (playlistId: string): Promise<PlaylistDetailsData> => {
    const response = await fetch(`/api/playlists/${playlistId}/details`, {
        credentials: 'include', // 重要: Cookieを含める
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (data) {
        const tracks = data.tracks?.items?.map((item: any) => ({
            ...item.track,
            audioFeatures: item.audioFeatures,
        })) || [];
        return {
            seedArtists: data.seedArtists || [],
            tracks: tracks,
            genreCounts: data.genreCounts || {},
            playlistName: data.playlistName || null,
            ownerId: data.ownerId || '',
            totalDuration: data.totalDuration || 0,
            averageAudioFeatures: data.averageAudioFeatures || {},
            ownerName: data.ownerName || '',
            maxAudioFeatures: data.maxAudioFeatures || {},
            minAudioFeatures: data.minAudioFeatures || {}
        };
    }
    throw new Error('Invalid response data');
};

/**
 * ミリ秒単位の時間をフォーマットされた文字列に変換します。
 *
 * @param millis - ミリ秒
 * @returns フォーマットされた時間文字列
 */
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

/**
 * プレイリストの詳細をロードし表示するコンポーネント。
 *
 * @param props - コンポーネントのプロパティ
 * @returns プレイリストの詳細コンポーネント
 */
const PlaylistDetailsLoader: React.FC<PlaylistDetailsLoaderProps> = ({
                                                                         playlistId,
                                                                         userId,
                                                                     }) => {
    const {
        data: playlistDetails,
        isLoading: isLoadingDetails,
        error: detailsError
    } = useQuery<PlaylistDetailsData, Error>({
        queryKey: ['playlistDetails', playlistId],
        queryFn: () => fetchPlaylistDetails(playlistId),
    });
    
    const {
        data: recommendations,
        isLoading: isLoadingRecommendations,
        error: recommendationsError
    } = useQuery<Track[], Error>({
        queryKey: ['recommendations', playlistId],
        queryFn: async () => {
            if (!playlistDetails) return [];
            
            const requestBody: RecommendationRequest = {
                seedArtists: playlistDetails.seedArtists,
                maxAudioFeatures: playlistDetails.maxAudioFeatures,
                minAudioFeatures: playlistDetails.minAudioFeatures,
            };
            
            const response = await fetch(`/api/playlists/recommendations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`recommendations fetch failed: ${response.status}`);
            }
            return response.json();
        },
        enabled: !!playlistDetails,
        retry: 3,
    });
    
    
    if (isLoadingDetails) {
        return <LoadingSpinner loading={isLoadingDetails}/>;
    }
    
    if (detailsError || !playlistDetails) {
        return <div>プレイリスト取得中にエラーが発生しました: {detailsError?.message}</div>;
    }
    
    const formattedDuration = formatDuration(playlistDetails.totalDuration);
    
    return (
        <PlaylistDetails
            tracks={playlistDetails.tracks}
            genreCounts={playlistDetails.genreCounts}
            recommendations={recommendations || []}
            playlistName={playlistDetails.playlistName}
            ownerId={playlistDetails.ownerId}
            userId={userId || ''}
            playlistId={playlistId}
            totalDuration={formattedDuration}
            averageAudioFeatures={playlistDetails.averageAudioFeatures}
            totalTracks={playlistDetails.tracks.length}
            ownerName={playlistDetails.ownerName}
            isLoadingRecommendations={isLoadingRecommendations}
        />
    );
};

export default PlaylistDetailsLoader;
