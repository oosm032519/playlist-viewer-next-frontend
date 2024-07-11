// app/components/PlaylistTable.tsx

import {Playlist} from "../types/playlist";
import {Table, TableBody} from "./ui/table";
import PlaylistTableHeader from "./PlaylistTableHeader";
import PlaylistTableRow from "./PlaylistTableRow";

interface PlaylistTableProps {
    playlists: Playlist[]; // プレイリストの配列
    onPlaylistClick: (playlistId: string) => void; // プレイリストがクリックされたときのコールバック関数
    currentPage: number; // 現在のページ番号
    totalPlaylists: number; // 総プレイリスト数
}

/**
 * プレイリストのテーブルを表示するコンポーネント
 * @param {PlaylistTableProps} props - プレイリストテーブルのプロパティ
 * @returns {JSX.Element} プレイリストテーブルのJSX要素
 */
export default function PlaylistTable({playlists, onPlaylistClick, currentPage, totalPlaylists}: PlaylistTableProps) {
    return (
        <Table>
            {/* テーブルのヘッダー部分 */}
            <PlaylistTableHeader/>
            <TableBody>
                {/* プレイリストごとに行を生成 */}
                {playlists.map((playlist) => (
                    <PlaylistTableRow
                        key={playlist.id} // 各行に一意のキーを設定
                        playlist={playlist} // プレイリストのデータを渡す
                        onClick={() => onPlaylistClick(playlist.id)} // クリック時にコールバック関数を呼び出す
                    />
                ))}
            </TableBody>
        </Table>
    );
}
