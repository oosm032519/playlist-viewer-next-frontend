// app/components/PlaylistTable.tsx

import {Playlist} from "@/app/types/playlist";
import {Table, TableBody} from "@/app/components/ui/table";
import PlaylistTableHeader from "@/app/components/PlaylistTableHeader";
import PlaylistTableRow from "@/app/components/PlaylistTableRow";

/**
 * プレイリストテーブルコンポーネントのプロパティを定義するインターフェース
 */
interface PlaylistTableProps {
    /** プレイリストの配列 */
    playlists: Playlist[];
    /** プレイリストがクリックされたときのコールバック関数 */
    onPlaylistClick: (playlistId: string) => void;
    /** 現在のページ番号 */
    currentPage: number;
    /** 総プレイリスト数 */
    totalPlaylists: number;
}

/**
 * プレイリストのテーブルを表示するコンポーネント
 *
 * @param {PlaylistTableProps} props - プレイリストテーブルのプロパティ
 * @returns {JSX.Element} プレイリストテーブルのJSX要素
 *
 * @example
 * <PlaylistTable
 *   playlists={playlists}
 *   onPlaylistClick={handlePlaylistClick}
 *   currentPage={1}
 *   totalPlaylists={100}
 * />
 */
export default function PlaylistTable({
                                          playlists,
                                          onPlaylistClick,
                                          totalPlaylists,
                                      }: PlaylistTableProps): JSX.Element {
    return (
        <Table>
            {/* テーブルのヘッダー部分 */}
            <PlaylistTableHeader totalPlaylists={totalPlaylists}/> {/* totalPlaylists を渡す */}
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
