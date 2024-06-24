"use client";

import React from "react";
import {Track} from "@/app/types/track";
import {PlaylistDetailsTable} from "@/app/components/PlaylistDetailsTable";

interface PlaylistDetailsProps {
    tracks: Track[];
}

const PlaylistDetails: React.FC<PlaylistDetailsProps> = ({tracks}) => {
    return (
        <PlaylistDetailsTable tracks={tracks}/>
    );
};

export default PlaylistDetails;
