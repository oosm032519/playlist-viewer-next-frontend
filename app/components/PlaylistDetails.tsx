// app/components/PlaylistDetails.tsx
"use client";

import React from "react";
import {Track} from "@/app/types/track";
import {PlaylistDetailsTable} from "@/app/components/PlaylistDetailsTable";
import GenreChart from "./GenreChart";
import {RecommendationsTable} from "@/app/components/RecommendationsTable";

interface PlaylistDetailsProps {
    tracks: Track[];
    genreCounts: { [genre: string]: number };
    recommendations: Track[];
    playlistName: string | null;
    ownerId: string | null;
    userId: string | null; // userId を受け取るようにプロパティを追加
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
                                                             ownerId,
                                                             userId // userId を受け取る
                                                         }) => {
    return (
        <>
            <PlaylistDetailsTable tracks={tracks}/>
            
            {/* ジャンル分布チャートの表示 */}
            <GenreDistributionChart genreCounts={genreCounts} playlistName={playlistName}/>
            
            {/* おすすめ楽曲を表示 */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Recommendations:</h3>
                <RecommendationsTable tracks={recommendations}/>
            </div>
            
            {/* 所有者のIDを表示 */}
            {ownerId && <p>作成者のID: {ownerId}</p>}
            
            {/* ログインユーザーと所有者が一致する場合のみテキストを表示 */}
            {ownerId && ownerId === userId && <p>ID一致 ID: {ownerId}</p>}
        </>
    );
};

export default PlaylistDetails;
