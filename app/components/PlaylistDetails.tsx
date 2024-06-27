// app/components/PlaylistDetails.tsx
"use client";

import React from "react";
import {Track} from "@/app/types/track";
import {PlaylistDetailsTable} from "@/app/components/PlaylistDetailsTable";
import GenreChart from "./GenreChart";

interface PlaylistDetailsProps {
    tracks: Track[];
    genreCounts: { [genre: string]: number };
}

const PlaylistDetails: React.FC<PlaylistDetailsProps> = ({tracks, genreCounts = {}}) => { // genreCounts の初期値を {} に設定
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
        </>
    );
};

export default PlaylistDetails;
