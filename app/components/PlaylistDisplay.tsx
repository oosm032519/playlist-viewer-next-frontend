// app/components/PlaylistDisplay.tsx

import {Card, CardContent, CardHeader, CardTitle} from '@/app/components/ui/card'
import React from 'react'
import PlaylistTable from "./PlaylistTable";
import PlaylistDetailsLoader from "./PlaylistDetailsLoader";
import FollowedPlaylists from "./FollowedPlaylists";
import {Playlist} from "../types/playlist";
import {useUser} from "../context/UserContext";
import {usePlaylist} from "../context/PlaylistContext";

/**
 * PlaylistDisplayコンポーネントのプロパティ
 * @property {Playlist[]} playlists - 表示するプレイリストの配列
 * @property {string | undefined} userId - 現在のユーザーのID
 * @property {(playlistId: string) => void} onPlaylistClick - プレイリストがクリックされた時のハンドラー
 */
interface PlaylistDisplayProps {
    playlists: Playlist[];
    userId: string | undefined;
    onPlaylistClick: (playlistId: string) => void;
}

/**
 * PlaylistDisplayコンポーネント
 * ユーザーにプレイリストを表示し、選択されたプレイリストの詳細をロードします。
 * @param {PlaylistDisplayProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} - プレイリスト表示のReact要素
 */
const PlaylistDisplay: React.FC<PlaylistDisplayProps> = ({
                                                             playlists,
                                                             userId,
                                                             onPlaylistClick,
                                                         }) => {
    // ユーザーのログイン状態を取得
    const {isLoggedIn} = useUser();
    // 現在選択されているプレイリストのIDを取得
    const {selectedPlaylistId} = usePlaylist();
    
    return (
        <>
            {/* プレイリストが存在し、何も選択されていない場合にプレイリストテーブルを表示 */}
            {playlists.length > 0 && !selectedPlaylistId && (
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">プレイリスト</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PlaylistTable
                            playlists={playlists}
                            onPlaylistClick={onPlaylistClick}
                            totalPlaylists={playlists.length}
                            currentPage={1} // 現在のページを固定で1に設定
                        />
                    </CardContent>
                </Card>
            )}
            
            {/* 選択されたプレイリストがある場合にその詳細をロード */}
            {selectedPlaylistId && (
                <PlaylistDetailsLoader
                    playlistId={selectedPlaylistId}
                    userId={userId}
                />
            )}
            
            {/* ユーザーがログインしている場合にフォローしているプレイリストを表示 */}
            {isLoggedIn && (
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">フォロー中のプレイリスト</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FollowedPlaylists onPlaylistClick={onPlaylistClick}/>
                    </CardContent>
                </Card>
            )}
        </>
    );
};

export default PlaylistDisplay;
