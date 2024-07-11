// app/components/PlaylistDetails.tsx
"use client";

import React from "react";
import {Track} from "../types/track";
import {PlaylistDetailsTable} from "./PlaylistDetailsTable";
import GenreChart from "./GenreChart";
import {RecommendationsTable} from "./RecommendationsTable";

interface PlaylistDetailsProps {
    tracks: Track[]; // プレイリスト内のトラックの配列
    genreCounts: { [genre: string]: number }; // ジャンルごとのトラック数を保持するオブジェクト
    recommendations: Track[]; // おすすめのトラックの配列
    playlistName: string | null; // プレイリストの名前
    ownerId: string; // プレイリストの所有者のID
    userId: string; // 現在のユーザーのID
    playlistId: string; // プレイリストのID
}

/**
 * ジャンル分布チャートを表示するコンポーネント
 */
const GenreDistributionChart: React.FC<{
    genreCounts: { [genre: string]: number }; // ジャンルごとのトラック数を保持するオブジェクト
    playlistName: string | null; // プレイリストの名前
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
    return null; // genreCounts が空の場合は何も表示しない
};

/**
 * プレイリストの詳細情報を表示するコンポーネント
 */
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
            {/* プレイリストのトラック一覧を表示 */}
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
