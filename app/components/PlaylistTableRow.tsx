// app/components/PlaylistTableRow.tsx

import {Playlist} from "@/app/types/playlist";
import {TableCell, TableRow} from "@/app/components/ui/table";
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
            <TableCell>{sanitizedImageUrl ? (
                <a href={playlist.externalUrls.externalUrls.spotify} target="_blank" rel="noopener noreferrer">
                    <div className="w-12 h-12 relative"><Image src={sanitizedImageUrl} alt={sanitizedName}
                                                               className="object-contain w-full h-full" width={60} height={60}/></div>
                </a>) : (
                <div className="w-12 h-12 bg-gray-200 rounded-full" data-testid="image-placeholder"></div>)}</TableCell>
            <TableCell onClick={onClick}>{sanitizedName}</TableCell>
            <TableCell onClick={onClick}>{playlist.tracks.total}</TableCell>
        </TableRow>
    );
}
