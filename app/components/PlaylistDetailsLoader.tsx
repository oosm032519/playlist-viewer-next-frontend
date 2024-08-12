// app/components/PlaylistDetailsLoader.tsx

"use client";

import {useQuery} from '@tanstack/react-query';
import {Track} from "../types/track";
import PlaylistDetails from "./PlaylistDetails";
import LoadingSpinner from "./LoadingSpinner";
import {AudioFeatures} from '../types/audioFeaturesTypes';

/**
 * プレイリストの詳細をロードするコンポーネントのプロパティを定義します。
 */
interface PlaylistDetailsLoaderProps {
    /** プレイリストのID */
    playlistId: string;
    /** ユーザーのID（オプション） */
    userId?: string;
}

/**
 * プレイリストデータのインターフェースを定義します。
 */
interface PlaylistData {
    tracks: Track[];
    genreCounts: { [genre: string]: number };
    recommendations: Track[];
    playlistName: string | null;
    ownerId: string;
    totalDuration: number;
    averageAudioFeatures: AudioFeatures;
    ownerName: string;
}

/**
 * プレイリストの詳細をAPIから取得します。
 *
 * @param playlistId - プレイリストのID
 * @returns プレイリストデータ
 * @throws ネットワークエラーまたは無効なデータの場合
 */
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
            ownerName: data.ownerName || '',
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
    // プレイリストデータを取得するクエリを実行
    const {data: playlistData, isLoading, error} = useQuery<PlaylistData, Error>({
        queryKey: ['playlistDetails', playlistId],
        queryFn: () => fetchPlaylistDetails(playlistId),
    });
    
    if (isLoading) {
        // データがロード中の場合、ローディングスピナーを表示
        return <LoadingSpinner loading={isLoading}/>;
    }
    
    if (error || !playlistData) {
        // エラーが発生した場合、エラーメッセージを表示
        return <div>プレイリスト取得中にエラーが発生しました</div>;
    }
    
    // トータルの再生時間をフォーマット
    const formattedDuration = formatDuration(playlistData.totalDuration);
    
    // プレイリストの詳細を表示
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
            ownerName={playlistData.ownerName}
        />
    );
};

export default PlaylistDetailsLoader;
