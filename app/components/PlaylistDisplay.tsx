// app/components/PlaylistDisplay.tsx

import PlaylistTable from "./PlaylistTable";
import PlaylistDetailsLoader from "./PlaylistDetailsLoader";
import FollowedPlaylists from "./FollowedPlaylists";
import {Playlist} from "../types/playlist";
import {useUser} from "../context/UserContext"; // useUserフックをインポート

/**
 * PlaylistDisplayコンポーネントのプロパティの型定義
 */
interface PlaylistDisplayProps {
    playlists: Playlist[]; // プレイリストの配列
    selectedPlaylistId: string | null; // 選択されたプレイリストのID
    userId: string | undefined; // ユーザーID
    onPlaylistClick: (playlistId: string) => void; // プレイリストがクリックされたときのコールバック関数
}

/**
 * PlaylistDisplayコンポーネント
 * @param playlists - プレイリストの配列
 * @param selectedPlaylistId - 選択されたプレイリストのID
 * @param userId - ユーザーID
 * @param onPlaylistClick - プレイリストがクリックされたときのコールバック関数
 * @returns プレイリストの表示コンポーネント
 */
const PlaylistDisplay: React.FC<PlaylistDisplayProps> = ({
                                                             playlists,
                                                             selectedPlaylistId,
                                                             userId,
                                                             onPlaylistClick,
                                                         }) => {
    const {isLoggedIn} = useUser(); // ContextからisLoggedInを取得
    
    return (
        <>
            {/* プレイリストが存在し、選択されたプレイリストがない場合、プレイリストテーブルを表示 */}
            {playlists.length > 0 && !selectedPlaylistId && (
                <PlaylistTable
                    playlists={playlists}
                    onPlaylistClick={onPlaylistClick}
                    totalPlaylists={playlists.length}
                    currentPage={1}
                />
            )}
            
            {/* 選択されたプレイリストがある場合、その詳細をロードするコンポーネントを表示 */}
            {selectedPlaylistId && (
                <PlaylistDetailsLoader
                    playlistId={selectedPlaylistId}
                    userId={userId}
                />
            )}
            
            {/* ユーザーがログインしている場合、フォローしているプレイリストを表示 */}
            {isLoggedIn && <FollowedPlaylists onPlaylistClick={onPlaylistClick}/>}
        </>
    );
};

export default PlaylistDisplay;
