// app/components/PlaylistDetails.tsx
"use client";

import React from "react";
import {Track} from "../types/track";
import {PlaylistDetailsTable} from "./PlaylistDetailsTable";
import GenreChart from "./GenreChart";
import {RecommendationsTable} from "./RecommendationsTable";

interface PlaylistDetailsProps {
    tracks: Track[];
    genreCounts: { [genre: string]: number };
    recommendations: Track[];
    playlistName: string | null;
    ownerId: string; // ownerId を props として受け取る
    userId: string; // userId を props として受け取る
    playlistId: string; // プレイリストIDを追加
}

/**
 * ジャンル分布チャートを表示するコンポーネント
 */
const GenreDistributionChart: React.FC<{
    genreCounts: { [genre: string]: number };
    playlistName: string | null;
}> = ({genreCounts, playlistName}) => {
    // genreCounts が空でない場合のみチャートを表示
    if (Object.keys(genreCounts).length > 0) {
        return (
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Genre Distribution:</h3>
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
                                                             ownerId, // ownerId を props から受け取る
                                                             userId, // userId を props から受け取る
                                                             playlistId, // プレイリストIDを受け取る
                                                         }) => {
    return (
        <>
            <PlaylistDetailsTable tracks={tracks}/>
            
            {/* ジャンル分布チャートの表示 */}
            <GenreDistributionChart
                genreCounts={genreCounts}
                playlistName={playlistName}
            />
            
            {/* おすすめ楽曲を表示 */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Recommendations:</h3>
                <RecommendationsTable
                    tracks={recommendations}
                    ownerId={ownerId} // ownerId を RecommendationsTable に渡す
                    userId={userId} // userId を RecommendationsTable に渡す
                    playlistId={playlistId} // playlistId を RecommendationsTable に渡す
                />
            </div>
        </>
    );
};

export default PlaylistDetails;
