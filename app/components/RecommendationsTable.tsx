"use client";

import React, {useRef, useState} from "react";
import {Track} from "@/app/types/track";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/components/ui/table";
import Image from "next/image";
import {Button} from "@/app/components/ui/button";

interface RecommendationsTableProps {
    tracks: Track[];
}

export const RecommendationsTable: React.FC<RecommendationsTableProps> = ({tracks}) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
    
    /**
     * 指定されたトラックの再生/停止を制御します。
     * @param trackId トラックID
     */
    const handlePlayTrack = (trackId: string) => {
        const track = tracks.find(t => t.id === trackId);
        if (track && audioRef.current) {
            if (currentTrackId === trackId && isPlaying) {
                // 同じトラックを再生中で、再生中の場合は停止する
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                // 別のトラックを再生する場合は、現在のトラックを設定して再生する
                audioRef.current.src = track.previewUrl || ''; // previewUrlがない場合は空文字列を設定
                audioRef.current.play();
                setIsPlaying(true);
                setCurrentTrackId(trackId);
            }
        }
    };
    
    return (
        <div className="w-full overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Album</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Artist</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tracks.map((track) => (
                        <TableRow key={track.id}>
                            <TableCell>
                                <Image
                                    src={track.album.images[0].url}
                                    alt={track.album.name}
                                    width={50}
                                    height={50}
                                    className="object-cover rounded-full"
                                />
                            </TableCell>
                            <TableCell>{track.name}</TableCell>
                            <TableCell>{track.artists[0].name}</TableCell>
                            <TableCell>
                                {/* preview_urlが存在する場合のみボタンを表示 */}
                                {track.previewUrl && (
                                    <Button onClick={() => handlePlayTrack(track.id)}>
                                        {isPlaying && currentTrackId === track.id ? "停止" : "試聴する"}
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <audio ref={audioRef}/>
        </div>
    );
};
