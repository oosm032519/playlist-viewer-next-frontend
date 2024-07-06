// app/components/RecommendationsTable.tsx

"use client";

import React, {useEffect} from "react";
import Image from "next/image";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "./ui/table";
import {Button} from "./ui/button";
import {TrackPlayer} from "./TrackPlayer";
import {addTrackToPlaylist, removeTrackFromPlaylist} from "../lib/utils";
import {RecommendationsTableProps} from '../types/recommendationsTableProps'

export const RecommendationsTable: React.FC<RecommendationsTableProps> = ({
                                                                              tracks,
                                                                              ownerId,
                                                                              userId,
                                                                              playlistId,
                                                                          }) => {
    useEffect(() => {
        console.log("ownerId:", ownerId);
        console.log("userId:", userId);
    }, [ownerId, userId]);
    
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
                                <TrackPlayer track={track}/>
                            </TableCell>
                            <TableCell>
                                {ownerId === userId && (
                                    <>
                                        <Button onClick={() => addTrackToPlaylist(playlistId, track.id as string)}>
                                            追加
                                        </Button>
                                        <Button onClick={() => removeTrackFromPlaylist(playlistId, track.id as string)}>
                                            削除
                                        </Button>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
