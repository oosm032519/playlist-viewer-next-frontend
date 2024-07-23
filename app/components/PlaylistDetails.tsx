// app/components/PlaylistDetails.tsx

"use client";

import React, {useContext, useState, useEffect} from "react";
import {Track} from "../types/track";
import {PlaylistDetailsTable} from "./PlaylistDetailsTable";
import GenreChart from "./GenreChart";
import {RecommendationsTable} from "./RecommendationsTable";
import {AudioFeatures} from "../types/audioFeaturesTypes";
import {FavoriteContext} from "../context/FavoriteContext";

interface PlaylistDetailsProps {
    tracks: Track[];
    genreCounts: { [genre: string]: number };
    recommendations: Track[];
    playlistName: string | null;
    ownerId: string;
    userId: string;
    playlistId: string;
    totalDuration: string;
    averageAudioFeatures: AudioFeatures;
    totalTracks: number;
}

const GenreDistributionChart: React.FC<{
    genreCounts: { [genre: string]: number };
    playlistName: string | null;
}> = ({genreCounts, playlistName}) => {
    if (Object.keys(genreCounts).length > 0) {
        return (
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">ジャンル分布:</h3>
                <GenreChart genreCounts={genreCounts} playlistName={playlistName}/>
            </div>
        );
    }
    return null;
};

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
                                                         }) => {
    const {favorites, addFavorite, removeFavorite} = useContext(FavoriteContext); // addFavorite, removeFavorite を追加
    const [isFavorite, setIsFavorite] = useState(false);
    
    useEffect(() => {
        setIsFavorite(playlistId in favorites);
    }, [favorites, playlistId]);
    
    const handleStarClick = async () => {
        try {
            const response = await fetch(
                `/api/playlists/favorite?playlistId=${playlistId}&playlistName=${encodeURIComponent(
                    playlistName || ''
                )}&totalTracks=${totalTracks}`,
                {
                    method: isFavorite ? 'DELETE' : 'POST',
                    credentials: 'include',
                }
            );
            
            if (response.ok) {
                // isFavorite の状態に応じて addFavorite または removeFavorite を呼び出す
                if (isFavorite) {
                    removeFavorite(playlistId);
                } else {
                    addFavorite(playlistId, playlistName || '', totalTracks); // totalTracks をここに追加
                }
            } else {
                console.error('お気に入り登録/解除に失敗しました。');
            }
        } catch (error) {
            console.error('お気に入り登録/解除中にエラーが発生しました。', error);
        }
    };
    
    return (
        <>
            {playlistName && (
                <div className="text-center my-4 flex items-center justify-center">
                    <h1 className="text-2xl font-bold mr-2">{playlistName}</h1>
                    <button onClick={handleStarClick} className="focus:outline-none">
                        {isFavorite ? (
                            <span className="text-yellow-400 text-2xl">★</span>
                        ) : (
                            <span className="text-gray-400 text-2xl">☆</span>
                        )}
                    </button>
                </div>
            )}
            
            <div className="text-center my-4">
                <h2 className="text-xl">楽曲数: {totalTracks}</h2>
                <h2 className="text-xl">総再生時間: {totalDuration}</h2>
            </div>
            
            <PlaylistDetailsTable
                tracks={tracks}
                averageAudioFeatures={averageAudioFeatures}
            />
            
            <GenreDistributionChart
                genreCounts={genreCounts}
                playlistName={playlistName}
            />
            
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">おすすめ:</h3>
                <RecommendationsTable
                    tracks={recommendations}
                    ownerId={ownerId}
                    userId={userId}
                    playlistId={playlistId}
                />
            </div>
        </>
    );
};

export default PlaylistDetails;
