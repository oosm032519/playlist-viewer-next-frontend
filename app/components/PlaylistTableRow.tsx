// app/components/PlaylistTableRow.tsx

import {Playlist} from "../types/playlist";
import {TableCell, TableRow} from "./ui/table";

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
    return (
        <TableRow onClick={onClick}>
            <TableCell>
                {playlist.images[0]?.url ? (
                    // プレイリストの画像が存在する場合は表示
                    <img
                        src={playlist.images[0].url}
                        alt={playlist.name}
                        className="w-12 h-12 object-cover rounded-full"
                        width={48}
                        height={48}
                    />
                ) : (
                    // プレイリストの画像が存在しない場合はプレースホルダーを表示
                    <div className="w-12 h-12 bg-gray-200 rounded-full" data-testid="image-placeholder"></div>
                )}
            </TableCell>
            <TableCell>{playlist.name}</TableCell>
            <TableCell>{playlist.tracks.total}</TableCell>
        </TableRow>
    );
}
