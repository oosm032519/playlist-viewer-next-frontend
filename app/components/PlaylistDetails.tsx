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
    recommendations: Track[]; // 追加: おすすめ楽曲のprops
    playlistName: string | null; // プレイリスト名
}

const PlaylistDetails: React.FC<PlaylistDetailsProps> = ({tracks, genreCounts = {}, recommendations, playlistName}) => {
    return (
        <>
            {playlistName && (
                <h2 className="text-2xl font-bold text-center mt-4">{playlistName}</h2>
            )}
            
            <PlaylistDetailsTable tracks={tracks}/>
            
            {/* genreCounts が undefined や null でない場合に GenreChart を表示 */}
            {genreCounts && Object.keys(genreCounts).length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Genre Distribution:</h3>
                    <GenreChart genreCounts={genreCounts} playlistName={playlistName}/>
                </div>
            )}
            
            {/* おすすめ楽曲を表示 */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Recommendations:</h3>
                <RecommendationsTable tracks={recommendations}/>
            </div>
        </>
    );
};

export default PlaylistDetails;
