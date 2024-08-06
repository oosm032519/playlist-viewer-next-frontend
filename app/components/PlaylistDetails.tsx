"use client";

import React, {useContext, useState, useEffect} from "react";
import {Track} from "../types/track";
import {PlaylistDetailsTable} from "./PlaylistDetailsTable";
import GenreChart from "./GenreChart";
import {RecommendationsTable} from "./RecommendationsTable";
import {AudioFeatures} from "../types/audioFeaturesTypes";
import {FavoriteContext} from "../context/FavoriteContext";
import DOMPurify from 'dompurify';

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
    ownerName: string;
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
                                                             ownerName,
                                                         }) => {
    const {favorites, addFavorite, removeFavorite} = useContext(FavoriteContext);
    const [isFavorite, setIsFavorite] = useState(false);
    
    useEffect(() => {
        setIsFavorite(playlistId in favorites);
    }, [favorites, playlistId]);
    
    const handleStarClick = async () => {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
        
        try {
            // get-jwt APIルートを使用してJWTを取得
            const jwtResponse = await fetch('/api/session/get-jwt');
            if (!jwtResponse.ok) {
                throw new Error('JWTの取得に失敗しました');
            }
            const {jwt} = await jwtResponse.json();
            
            const response = await fetch(
                `${backendUrl}/api/playlists/favorite?playlistId=${encodeURIComponent(playlistId)}&playlistName=${encodeURIComponent(
                    playlistName || ''
                )}&totalTracks=${encodeURIComponent(totalTracks)}&playlistOwnerName=${encodeURIComponent(ownerName || '')}`,
                {
                    method: isFavorite ? 'DELETE' : 'POST',
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                    },
                }
            );
            
            if (response.ok) {
                if (isFavorite) {
                    removeFavorite(playlistId);
                } else {
                    addFavorite(playlistId, playlistName || '', totalTracks);
                }
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
                    <button onClick={handleStarClick} className="focus:outline-none ml-2">
                        <span className={`text-2xl ${isFavorite ? 'text-yellow-400' : 'text-gray-400'}`}>
                            {isFavorite ? '★' : '☆'}
                        </span>
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
