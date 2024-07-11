// app/components/TrackPlayer.tsx

import React, {useRef, useState} from "react";
import {Button} from "./ui/button";
import {Track} from "../types/track";

interface TrackPlayerProps {
    track: Track;
}

/**
 * TrackPlayerコンポーネント
 * 指定されたトラックのプレビューを再生・停止する機能を提供します。
 *
 * @param {TrackPlayerProps} props - トラック情報を含むプロパティ
 * @returns {JSX.Element} トラックプレーヤーのUI
 */
export const TrackPlayer: React.FC<TrackPlayerProps> = ({track}) => {
    // オーディオ要素への参照を保持するためのuseRefフック
    const audioRef = useRef<HTMLAudioElement>(null);
    // 再生状態を管理するためのuseStateフック
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    
    /**
     * トラックの再生・停止を切り替える関数
     */
    const handlePlayTrack = () => {
        if (audioRef.current) {
            if (isPlaying) {
                // トラックが再生中の場合、再生を停止する
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                // トラックが停止中の場合、再生を開始する
                audioRef.current.src = track.previewUrl || "";
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };
    
    return (
        <>
            {track.previewUrl && (
                // 再生・停止ボタンを表示する
                <Button onClick={handlePlayTrack}>
                    {isPlaying ? "停止" : "試聴する"}
                </Button>
            )}
            {/* オーディオ要素をレンダリングする */}
            <audio ref={audioRef}/>
        </>
    );
};
