// app/components/PlaylistTableRow.tsx

import {Playlist} from "../types/playlist";
import {TableCell, TableRow} from "./ui/table";
import DOMPurify from 'dompurify';
import {useEffect, useState} from 'react';
import Image from "next/image";

interface PlaylistTableRowProps {
    playlist: Playlist;
    onClick: () => void;
}

/**
 * プレイリストの情報を表示するテーブル行コンポーネント
 * @param {PlaylistTableRowProps} props - プレイリストとクリックハンドラを含むプロパティ
 * @returns {JSX.Element} - テーブル行のJSX要素
 */
export default function PlaylistTableRow({playlist, onClick}: PlaylistTableRowProps) {
    const [sanitizedImageUrl, setSanitizedImageUrl] = useState<string>('');
    const [sanitizedName, setSanitizedName] = useState<string>('');
    
    useEffect(() => {
        if (playlist.images[0]?.url) {
            setSanitizedImageUrl(DOMPurify.sanitize(playlist.images[0].url));
        }
        setSanitizedName(DOMPurify.sanitize(playlist.name));
    }, [playlist]);
    
    return (
        <TableRow>
            <TableCell>
                {sanitizedImageUrl ? (
                    // 画像をクリックするとSpotifyページに遷移
                    <a href={playlist.externalUrls.externalUrls.spotify} target="_blank" rel="noopener noreferrer">
                        <div className="w-12 h-12 relative">
                            <Image
                                src={sanitizedImageUrl}
                                alt={sanitizedName}
                                className="object-contain w-full h-full"
                                width={640}
                                height={640}
                            />
                        </div>
                    </a>
                ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full" data-testid="image-placeholder"></div>
                )}
            </TableCell>
            <TableCell onClick={onClick}>{sanitizedName}</TableCell> {/* 名前列をクリックすると詳細表示 */}
            <TableCell
                onClick={onClick}>{playlist.tracks.total}</TableCell> {/* トラック数列をクリックすると詳細表示 */}
        </TableRow>
    );
}
