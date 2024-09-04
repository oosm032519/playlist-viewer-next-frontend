// app/components/PlaylistTableRow.tsx

import {Playlist} from "../types/playlist";
import {TableCell, TableRow} from "./ui/table";
import DOMPurify from 'dompurify';
import {useEffect, useState} from 'react';

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
        <TableRow onClick={onClick}>
            <TableCell>
                {sanitizedImageUrl ? (
                    <img
                        src={sanitizedImageUrl}
                        alt={sanitizedName}
                        width={48}
                        height={48}
                    />
                ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full" data-testid="image-placeholder"></div>
                )}
            </TableCell>
            <TableCell>{sanitizedName}</TableCell>
            <TableCell>{playlist.tracks.total}</TableCell>
        </TableRow>
    );
}
