// app/components/PlaylistDetailsLoader.tsx
"use client";

import {useQuery} from '@tanstack/react-query';
import {Track} from "../types/track";
import PlaylistDetails from "./PlaylistDetails";
import LoadingSpinner from "./LoadingSpinner";

/**
 * PlaylistDetailsLoaderコンポーネントのプロパティの型定義
 */
interface PlaylistDetailsLoaderProps {
    playlistId: string;
    userId?: string;
}

/**
 * プレイリストデータの型定義
 */
interface PlaylistData {
    tracks: Track[];
    genreCounts: { [genre: string]: number };
    recommendations: Track[];
    playlistName: string | null;
    ownerId: string;
}

/**
 * プレイリストの詳細情報を取得する非同期関数
 * @param playlistId - 取得するプレイリストのID
 * @returns プレイリストデータを含むPromise
 * @throws ネットワークエラーまたは無効なデータの場合にエラーをスロー
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
        };
    }
    throw new Error('Invalid response data');
};

/**
 * プレイリストの詳細情報をロードし、表示するコンポーネント
 * @param playlistId - 表示するプレイリストのID
 * @param userId - オプションのユーザーID
 * @returns プレイリストの詳細情報を表示するコンポーネント
 */
const PlaylistDetailsLoader: React.FC<PlaylistDetailsLoaderProps> = ({
                                                                         playlistId,
                                                                         userId,
                                                                     }) => {
    // useQueryフックを使用してプレイリストデータを取得
    const {data: playlistData, isLoading, error} = useQuery<PlaylistData, Error>({
        queryKey: ['playlistDetails', playlistId],
        queryFn: () => fetchPlaylistDetails(playlistId),
    });
    
    // ローディング中の場合、ローディングスピナーを表示
    if (isLoading) {
        return <LoadingSpinner loading={isLoading}/>;
    }
    
    // エラーが発生した場合、エラーメッセージを表示
    if (error || !playlistData) {
        return <div>プレイリスト取得中にエラーが発生しました</div>;
    }
    
    // プレイリストの詳細情報を表示
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
