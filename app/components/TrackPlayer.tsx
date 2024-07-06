// app/components/TrackPlayer.tsx

import React, {useRef, useState} from "react";
import {Button} from "./ui/button";
import {Track} from "../types/track";

interface TrackPlayerProps {
    track: Track;
}

export const TrackPlayer: React.FC<TrackPlayerProps> = ({track}) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    
    const handlePlayTrack = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.src = track.previewUrl || "";
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };
    
    return (
        <>
            {track.previewUrl && (
                <Button onClick={handlePlayTrack}>
                    {isPlaying ? "停止" : "試聴する"}
                </Button>
            )}
            <audio ref={audioRef}/>
        </>
    );
};
