// app/components/PlaylistDetails.tsx

"use client";

import {playlistDetailsTableColumns} from '@/app/lib/PlaylistDetailsTableColumns'
import React, {useContext, useState, useEffect, useCallback} from "react";
import {Track} from "../types/track";
import {PlaylistDetailsTable} from "./PlaylistDetailsTable";
import GenreChart from "./GenreChart";
import {RecommendationsTable} from "./RecommendationsTable";
import {AudioFeatures} from "../types/audioFeaturesTypes";
import {FavoriteContext} from "../context/FavoriteContext";
import DOMPurify from 'dompurify';
import {useUser} from '@/app/context/UserContext';
import CombinedAudioFeaturesChart from "./CombinedAudioFeaturesChart";
import {CSVLink} from "react-csv"; // CSVLinkをインポート
import {Button} from "./ui/button"; // Buttonコンポーネントをインポート

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
        const headers = playlistDetailsTableColumns.map((column) => column.header as string);
        const data = tracks.map((track) =>
            playlistDetailsTableColumns.map((column) => {
                if (column.id === "album") {
                    return track.album.name;
                }
                if (column.id === "artists") {
                    return track.artists[0].name;
                }
                if ('accessorFn' in column && column.accessorFn) {
                    return column.accessorFn(track, 0);
                }
                if ('accessorKey' in column && column.accessorKey) {
                    return track[column.accessorKey as keyof Track];
                }
                return '';
            })
        );
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
                console.error('お気に入り登録/解除に失敗しました。');
            }
        } catch (error) {
            console.error('お気に入り登録/解除中にエラーが発生しました。', error);
        }
    };
    
    // DOMPurifyを使用して安全な文字列を作成
    const sanitizedPlaylistName = DOMPurify.sanitize(playlistName || '');
    const sanitizedOwnerName = DOMPurify.sanitize(ownerName || '');
    
    return (
        <>
            {playlistName && (
                <div className="text-center my-4 flex items-center justify-center">
                    <h1 className="text-2xl font-bold mr-2">
                        {sanitizedPlaylistName}
                    </h1>
                    <span>by </span>
                    <span>{sanitizedOwnerName}</span>
                    {/* ログインしている場合のみ星ボタンを表示 */}
                    {isLoggedIn && (
                        <button onClick={handleStarClick} className="focus:outline-none ml-2">
                            <span className={`text-2xl ${isFavorite ? 'text-yellow-400' : 'text-gray-400'}`}>
                                {isFavorite ? '★' : '☆'}
                            </span>
                        </button>
                    )}
                </div>
            )}
            
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
            
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2 flex justify-center items-center">
                    <div className="w-full max-w-2xl mx-auto mb-8">
                        <CombinedAudioFeaturesChart
                            track={selectedTrack || undefined}
                            averageAudioFeatures={averageAudioFeatures}
                            playlistName={playlistName}
                        />
                        {!selectedTrack && (
                            <p className="mt-4 text-center text-gray-500">
                                トラックを選択すると、個別の Audio Features が表示されます。
                            </p>
                        )}
                    </div>
                </div>
                <div className="w-full md:w-1/2 flex justify-center items-center">
                    <GenreDistributionChart genreCounts={genreCounts} playlistName={playlistName}/>
                </div>
            </div>
            
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">おすすめ:</h3>
                <RecommendationsTable tracks={recommendations} ownerId={ownerId} userId={userId}
                                      playlistId={playlistId}/>
            </div>
        </>
    );
};

export default PlaylistDetails;
