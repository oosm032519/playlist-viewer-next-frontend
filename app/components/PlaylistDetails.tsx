// app/components/PlaylistDetails.tsx

"use client";

import {Card, CardContent, CardHeader, CardTitle} from '@/app/components/ui/card'
import React, {useContext, useState, useEffect, useCallback} from "react";
import {Track} from "@/app/types/track";
import {PlaylistDetailsTable} from "@/app/components/PlaylistDetailsTable";
import GenreChart from "@/app/components/GenreChart";
import {RecommendationsTable} from "@/app/components/RecommendationsTable";
import {AudioFeatures} from "@/app/types/audioFeaturesTypes";
import {FavoriteContext} from "@/app/context/FavoriteContext";
import DOMPurify from 'dompurify';
import {useUser} from '@/app/context/UserContext';
import CombinedAudioFeaturesChart from "@/app/components/CombinedAudioFeaturesChart";
import {CSVLink} from "react-csv";
import {Button} from "@/app/components/ui/button";

/**
 * プレイリストの詳細情報を表示するためのコンポーネントのプロパティ
 */
interface PlaylistDetailsProps {
    tracks: Track[]; // プレイリスト内のトラックリスト
    genreCounts: { [genre: string]: number }; // ジャンルごとのトラック数
    recommendations: Track[]; // 推奨トラックリスト
    playlistName: string | null; // プレイリスト名
    ownerId: string; // プレイリスト所有者のID
    userId: string; // 現在のユーザーのID
    playlistId: string; // プレイリストのID
    totalDuration: string; // プレイリストの総再生時間
    averageAudioFeatures: AudioFeatures; // 平均的なオーディオ特徴量
    totalTracks: number; // プレイリスト内のトラック数
    ownerName: string; // プレイリスト所有者の名前
    isLoadingRecommendations: boolean; // 推奨トラックの読み込み中かどうか
}

/**
 * ジャンル分布を表示するためのコンポーネント
 *
 * @param genreCounts ジャンルごとのトラック数
 * @param playlistName プレイリスト名
 * @returns ジャンル分布チャート
 */
const GenreDistributionChart: React.FC<{
    genreCounts: { [genre: string]: number };
    playlistName: string | null;
}> = ({genreCounts, playlistName}) => {
    if (Object.keys(genreCounts).length > 0) {
        return (
            <div className="mt-8">
                <GenreChart genreCounts={genreCounts} playlistName={playlistName}/>
            </div>
        );
    }
    return null;
};

/**
 * プレイリストの詳細を表示するコンポーネント
 *
 * @param props プレイリストの詳細情報
 * @returns プレイリスト詳細ビュー
 */
const PlaylistDetails: React.FC<PlaylistDetailsProps> = ({
                                                             tracks,
                                                             genreCounts = {},
                                                             recommendations,
                                                             playlistName,
                                                             ownerId,
                                                             userId,
                                                             playlistId,
                                                             totalDuration,
                                                             averageAudioFeatures,
                                                             totalTracks,
                                                             ownerName,
                                                         }) => {
    
    const generateCsvData = () => {
        const headers = [
            "Album", "Title", "Artist", "Danceability", "Energy", "Key", "Loudness",
            "Speechiness", "Acousticness", "Instrumentalness", "Liveness", "Valence",
            "Tempo", "Mode", "Duration", "Time Signature"
        ];
        
        const data = tracks.map((track) => {
            return [
                track.album.name,
                track.name,
                track.artists.map((artist) => artist.name).join(", "),
                track.audioFeatures?.danceability ?? "",
                track.audioFeatures?.energy ?? "",
                track.audioFeatures?.key ?? "",
                track.audioFeatures?.loudness ?? "",
                track.audioFeatures?.speechiness ?? "",
                track.audioFeatures?.acousticness ?? "",
                track.audioFeatures?.instrumentalness ?? "",
                track.audioFeatures?.liveness ?? "",
                track.audioFeatures?.valence ?? "",
                track.audioFeatures?.tempo ?? "",
                track.audioFeatures?.mode ?? "",
                track.durationMs ?? "",
                track.audioFeatures?.timeSignature ?? "",
            ];
        });
        
        return [headers, ...data];
    };
    
    const {favorites, addFavorite, removeFavorite} = useContext(FavoriteContext);
    const {isLoggedIn} = useUser(); // UserContextからisLoggedInを取得
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
    
    /**
     * お気に入りの状態をチェックする関数
     */
    const checkFavoriteStatus = useCallback(() => {
        setIsFavorite(playlistId in favorites);
    }, [favorites, playlistId]);
    
    useEffect(() => {
        if (isLoggedIn) {
            checkFavoriteStatus();
        }
    }, [isLoggedIn, checkFavoriteStatus]);
    
    /**
     * お気に入りの追加または削除を行うハンドラー
     */
    const handleStarClick = async () => {
        try {
            const response = await fetch(
                `/api/playlists/favorite`,
                {
                    method: isFavorite ? 'DELETE' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        playlistId,
                        playlistName: playlistName || '',
                        totalTracks,
                        playlistOwnerName: ownerName || '',
                    }),
                    credentials: 'include',
                }
            );
            
            if (response.ok) {
                if (isFavorite) {
                    removeFavorite(playlistId);
                } else {
                    addFavorite(playlistId, playlistName || '', totalTracks);
                }
                setIsFavorite(!isFavorite);
            } else {
            }
        } catch (error) {
        }
    };
    
    // DOMPurifyを使用して安全な文字列を作成
    const sanitizedPlaylistName = DOMPurify.sanitize(playlistName || '');
    const sanitizedOwnerName = DOMPurify.sanitize(ownerName || '');
    
    return (
        <>
            <Card>
                <CardHeader>
            {playlistName && (
                <CardTitle className="text-center my-4 flex items-center justify-center">
                    <p className="text-2xl font-bold mr-2">
                        {sanitizedPlaylistName}
                    </p>
                    <span className="mr-2">by </span>
                    <span>{sanitizedOwnerName}</span>
                    {/* ログインしている場合のみ星ボタンを表示 */}
                    {isLoggedIn && (
                        <button onClick={handleStarClick} className="focus:outline-none ml-2">
                            <span className={`text-2xl ${isFavorite ? 'text-yellow-400' : 'text-gray-400'}`}>
                                {isFavorite ? '★' : '☆'}
                            </span>
                        </button>
                    )}
                </CardTitle>
            )}
                </CardHeader>
                
                <CardContent>
            <div className="my-4 flex justify-between items-center">
                {/* CSVエクスポートボタン */}
                <CSVLink data={generateCsvData()} filename="playlist_details.csv" className="flex-none">
                    <Button variant="default" className="mb-4">
                        CSVをエクスポート
                    </Button>
                </CSVLink>
                <div className="flex-grow text-center">
                    <h2 className="text-xl">楽曲数: {totalTracks}</h2>
                    <h2 className="text-xl">総再生時間: {totalDuration}</h2>
                </div>
            </div>
            
            <PlaylistDetailsTable
                tracks={tracks}
                averageAudioFeatures={averageAudioFeatures}
                selectedTrack={selectedTrack}
                onTrackSelect={setSelectedTrack}
            />
                </CardContent>
                </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="w-full">
                    <CombinedAudioFeaturesChart
                        track={selectedTrack || undefined}
                        averageAudioFeatures={averageAudioFeatures}
                        playlistName={playlistName}
                    />
                </div>
                <div className="w-full">
                    <GenreDistributionChart genreCounts={genreCounts} playlistName={playlistName}/>
                </div>
            </div>
            
            {recommendations && recommendations.length > 0 ? ( // おすすめ楽曲が取得できている場合
                <Card className="mt-4">
                    <CardHeader className="text-2xl font-bold">おすすめ楽曲</CardHeader>
                    <CardContent>
                        <RecommendationsTable tracks={recommendations} ownerId={ownerId} userId={userId}
                                              playlistId={playlistId}/>
                    </CardContent>
                </Card>
            ) : null}
        </>
    );
};

export default PlaylistDetails;
