// app/components/PlaylistDetailsLoader.tsx
"use client";

import {useQuery} from '@tanstack/react-query';
import {Track} from "@/app/types/track";
import PlaylistDetails from "@/app/components/PlaylistDetails";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import {AudioFeatures} from '@/app/types/audioFeaturesTypes';

/**
 * `PlaylistDetailsLoader`コンポーネントに渡されるpropsのインターフェース。
 */
interface PlaylistDetailsLoaderProps {
    /** プレイリストのID */
    playlistId: string;
    /** ユーザーのID（オプション） */
    userId?: string;
}

/**
 * プレイリストの詳細データのインターフェース。
 */
interface PlaylistDetailsData {
    seedArtists: string[];  // プレイリストの種となるアーティスト
    tracks: Track[];  // プレイリスト内のトラックのリスト
    genreCounts: { [genre: string]: number };  // ジャンルごとのトラック数
    playlistName: string | null;  // プレイリスト名
    ownerId: string;  // プレイリストの所有者ID
    totalDuration: number;  // プレイリストの合計持続時間（ミリ秒）
    averageAudioFeatures: AudioFeatures;  // 平均的なオーディオ特性
    ownerName: string;  // プレイリスト所有者の名前
    maxAudioFeatures: { [key: string]: number };  // 最大オーディオ特性
    minAudioFeatures: { [key: string]: number };  // 最小オーディオ特性
}

/**
 * プレイリストのレコメンデーションリクエストデータのインターフェース。
 */
interface RecommendationRequest {
    seedArtists: string[];  // レコメンデーションの種となるアーティスト
    maxAudioFeatures: { [key: string]: number };  // 最大オーディオ特性
    minAudioFeatures: { [key: string]: number };  // 最小オーディオ特性
}

/**
 * 指定されたプレイリストIDに基づいてプレイリストの詳細を取得する非同期関数。
 *
 * @param playlistId - プレイリストのID
 * @returns プレイリストの詳細データ
 * @throws ネットワークエラーや無効なデータに対する例外
 */
const fetchPlaylistDetails = async (playlistId: string): Promise<PlaylistDetailsData> => {
    const response = await fetch(`/api/playlists/${playlistId}/details`, {
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (data) {
        // トラック情報を整形して返す
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
 * ミリ秒単位の時間をフォーマットされた文字列に変換する。
 *
 * @param millis - ミリ秒単位の時間
 * @returns フォーマットされた時間文字列（例: "1時間30分45秒"）
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
 * プレイリストの詳細を取得し、表示するためのコンポーネント。
 * プレイリストIDに基づいてデータを取得し、ローディングスピナーやエラーハンドリングを行う。
 *
 * @param props - `PlaylistDetailsLoaderProps`型のプロパティ
 * @returns プレイリストの詳細コンポーネントをレンダリング
 */
const PlaylistDetailsLoader: React.FC<PlaylistDetailsLoaderProps> = ({
                                                                         playlistId,
                                                                         userId
                                                                     }) => {
    // プレイリストの詳細データを取得
    const {
        data: playlistDetails,
        isLoading: isLoadingDetails,
        error: detailsError
    } = useQuery<PlaylistDetailsData, Error>({
        queryKey: ['playlistDetails', playlistId],
        queryFn: () => fetchPlaylistDetails(playlistId),
        refetchOnWindowFocus: false,
    });
    
    // プレイリストに基づくレコメンデーションデータを取得
    const {
        data: recommendations,
        isLoading: isLoadingRecommendations
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
        enabled: !!playlistDetails,  // プレイリストの詳細が取得されている場合のみ実行
        retry: 3,  // レコメンデーション取得失敗時のリトライ回数
        refetchOnWindowFocus: false,
    });
    
    // プレイリストの詳細がロード中の場合、スピナーを表示
    if (isLoadingDetails) {
        return <LoadingSpinner loading={isLoadingDetails}/>;
    }
    
    // エラーが発生した場合、エラーメッセージを表示
    if (detailsError || !playlistDetails) {
        return <div>プレイリスト取得中にエラーが発生しました: {detailsError?.message}</div>;
    }
    
    // プレイリストの総持続時間をフォーマット
    const formattedDuration = formatDuration(playlistDetails.totalDuration);
    
    // プレイリストの詳細コンポーネントを表示
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
