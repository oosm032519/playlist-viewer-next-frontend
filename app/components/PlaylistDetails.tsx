// C:\Users\IdeaProjects\playlist-viewer-next-frontend\app\components\PlaylistDetails.tsx
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
}

const PlaylistDetails: React.FC<PlaylistDetailsProps> = ({tracks, genreCounts = {}, recommendations = []}) => {
    return (
        <>
            <PlaylistDetailsTable tracks={tracks}/>
            
            {/* genreCounts が undefined や null でない場合に GenreChart を表示 */}
            {genreCounts && Object.keys(genreCounts).length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Genre Distribution:</h3>
                    <GenreChart genreCounts={genreCounts}/>
                </div>
            )}
            
            {/* おすすめ楽曲を表示 */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Recommendations:</h3>
                <RecommendationsTable tracks={recommendations}/> {/* おすすめ楽曲のテーブル */}
            </div>
        </>
    );
};

export default PlaylistDetails;
