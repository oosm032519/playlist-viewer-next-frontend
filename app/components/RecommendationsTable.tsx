// C:\Users\IdeaProjects\playlist-viewer-next-frontend\app\components\RecommendationsTable.tsx
"use client";

import React from "react";
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
                                    <Button asChild>
                                        <a href={track.previewUrl} target="_blank" rel="noopener noreferrer">
                                            試聴する
                                        </a>
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
