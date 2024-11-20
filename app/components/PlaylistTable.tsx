// app/components/PlaylistTable.tsx

import {Playlist} from "@/app/types/playlist";
import {Table, TableBody} from "@/app/components/ui/table";
import PlaylistTableHeader from "@/app/components/PlaylistTableHeader";
import PlaylistTableRow from "@/app/components/PlaylistTableRow";
import {useMemo} from 'react'

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
 */
export default function PlaylistTable({playlists, onPlaylistClick, totalPlaylists}: PlaylistTableProps): JSX.Element {
    const memoizedPlaylists = useMemo(() => playlists, [playlists]);
    
    return (
        <Table>
            <PlaylistTableHeader totalPlaylists={totalPlaylists}/>
            <TableBody>
                {memoizedPlaylists.map((playlist) => (
                    <PlaylistTableRow
                        key={playlist.id}
                        playlist={playlist}
                        onClick={() => onPlaylistClick(playlist.id)}
                    />
                ))}
            </TableBody>
        </Table>
    );
}
