// app/components/RecommendationsTable.tsx

"use client";

import React, {useEffect, useRef, useState} from "react";
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
    ownerId: string;
    userId: string;
    playlistId: string;
}

export const RecommendationsTable: React.FC<RecommendationsTableProps> = ({
                                                                              tracks,
                                                                              ownerId,
                                                                              userId,
                                                                              playlistId,
                                                                          }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
    
    // コンポーネントがレンダリングされるたびに実行されるuseEffect
    useEffect(() => {
        // ownerIdとuserIdをコンソールに出力
        console.log("ownerId:", ownerId);
        console.log("userId:", userId);
    }, [ownerId, userId]);
    
    /**
     * 指定されたトラックの再生/停止を制御します。
     * @param trackId トラックID
     */
    const handlePlayTrack = (trackId: string) => {
        const track = tracks.find((t) => t.id === trackId);
        if (track && audioRef.current) {
            if (currentTrackId === trackId && isPlaying) {
                // 同じトラックを再生中で、再生中の場合は停止する
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                // 別のトラックを再生する場合は、現在のトラックを設定して再生する
                audioRef.current.src = track.previewUrl || ""; // previewUrlがない場合は空文字列を設定
                audioRef.current.play();
                setIsPlaying(true);
                setCurrentTrackId(trackId);
            }
        }
    };
    
    // 曲を追加する関数
    const handleAddTrack = async (trackId: string) => {
        try {
            const response = await fetch(`/api/playlists/${playlistId}/tracks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({trackId}), // 追加する曲のIDを指定
            });
            
            if (response.ok) {
                // 成功時の処理
                console.log("曲が正常に追加されました");
            } else {
                // エラー時の処理
                console.error("曲の追加に失敗しました");
            }
        } catch (error) {
            console.error("エラーが発生しました:", error);
        }
    };
    
    // 曲を削除する関数
    const handleRemoveTrack = async (trackId: string) => {
        try {
            const response = await fetch(`/api/playlists/${playlistId}/tracks`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({trackId}), // 削除する曲のIDを指定
            });
            
            if (response.ok) {
                // 成功時の処理
                console.log("曲が正常に削除されました");
            } else {
                // エラー時の処理
                console.error("曲の削除に失敗しました");
            }
        } catch (error) {
            console.error("エラーが発生しました:", error);
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
                        <TableHead>Preview</TableHead>
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
                                    <Button onClick={() => handlePlayTrack(track.id as string)}>
                                        {isPlaying && currentTrackId === track.id ? "停止" : "試聴する"}
                                    </Button>
                                )}
                            </TableCell>
                            <TableCell>
                                {ownerId === userId && (
                                    <>
                                        <Button onClick={() => handleAddTrack(track.id as string)}>
                                            追加
                                        </Button>
                                        <Button onClick={() => handleRemoveTrack(track.id as string)}>
                                            削除
                                        </Button>
                                    </>
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
