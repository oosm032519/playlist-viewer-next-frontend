// app/components/PlaylistDisplay.tsx

import LoadingSpinner from '@/app/components/LoadingSpinner'
import {Card, CardContent, CardHeader, CardTitle} from "@/app/components/ui/card";
import React, {useState, useEffect} from "react";
import PlaylistTable from "./PlaylistTable";
import PlaylistDetailsLoader from "./PlaylistDetailsLoader";
import FollowedPlaylists from "./FollowedPlaylists";
import {Playlist} from "../types/playlist";
import {useUser} from "../context/UserContext";
import {usePlaylist} from "../context/PlaylistContext";
import {useQueryClient} from "@tanstack/react-query";
import {useSearchPlaylists} from "../hooks/useSearchPlaylists";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/app/components/ui/pagination";

/**
 * PlaylistDisplayコンポーネントのプロパティ
 * @property {Playlist[]} playlists - 表示するプレイリストの配列
 * @property {string | undefined} userId - 現在のユーザーのID
 * @property {(playlistId: string) => void} onPlaylistClick - プレイリストがクリックされた時のハンドラー
 * @property {string} onSearchQuery - 検索クエリ
 */
interface PlaylistDisplayProps {
    playlists: Playlist[];
    userId: string | undefined;
    onPlaylistClick: (playlistId: string) => void;
    onSearchQuery: string;
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
                                                             onSearchQuery,
                                                         }) => {
    // ユーザーのログイン状態を取得
    const {isLoggedIn} = useUser();
    // 現在選択されているプレイリストのIDを取得
    const {selectedPlaylistId} = usePlaylist();
    // 現在のページ番号を管理するステート
    const [currentPage, setCurrentPage] = useState(1);
    // 現在のプレイリストデータを管理するステート
    const [currentPlaylists, setCurrentPlaylists] = useState<Playlist[]>([]);
    // React Queryのクライアントを取得
    const queryClient = useQueryClient();
    
    // プレイリスト検索のミューテーションを設定
    const searchMutation = useSearchPlaylists((data) => {
        setCurrentPlaylists(data);
    });
    
    // 検索クエリを受け取って検索を実行
    useEffect(() => {
        setCurrentPage(1);
        searchMutation.mutate({query: onSearchQuery, page: 1, limit: 20});
    }, [onSearchQuery]);
    
    /**
     * 次のページボタン押下時の処理
     */
    const handleNextPage = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        
        // キャッシュからデータを取得
        const cachedData = queryClient.getQueryData([
            "playlists",
            onSearchQuery,
            nextPage,
        ]) as Playlist[] | undefined;
        
        if (cachedData) {
            // キャッシュがある場合はキャッシュからデータを設定
            setCurrentPlaylists(cachedData);
        } else {
            // キャッシュがない場合はAPIリクエストを送信
            searchMutation.mutate({
                query: onSearchQuery,
                page: nextPage,
                limit: 20,
            });
        }
    };
    
    /**
     * 前のページボタン押下時の処理
     */
    const handlePrevPage = () => {
        const prevPage = currentPage - 1;
        setCurrentPage(prevPage);
        
        // キャッシュからデータを取得
        const cachedData = queryClient.getQueryData([
            "playlists",
            onSearchQuery,
            prevPage,
        ]) as Playlist[] | undefined;
        
        if (cachedData) {
            // キャッシュがある場合はキャッシュからデータを設定
            setCurrentPlaylists(cachedData);
        } else {
            // キャッシュがない場合はAPIリクエストを送信
            searchMutation.mutate({
                query: onSearchQuery,
                page: prevPage,
                limit: 20,
            });
        }
    };
    
    return (
        <>
            {/* LoadingSpinner を表示 */}
            <LoadingSpinner loading={searchMutation.isPending}/>
            {/* プレイリストが存在し、何も選択されていない場合にプレイリストテーブルを表示 */}
            {currentPlaylists.length > 0 && !selectedPlaylistId && (
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">プレイリスト</CardTitle>
                        {/* ページネーション */}
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={currentPage > 1 ? handlePrevPage : undefined}
                                    />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#" isActive>
                                        {currentPage}
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={currentPlaylists.length === 20 ? handleNextPage : undefined}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </CardHeader>
                    <CardContent>
                        <PlaylistTable
                            playlists={currentPlaylists}
                            onPlaylistClick={onPlaylistClick}
                            totalPlaylists={currentPlaylists.length}
                            currentPage={currentPage}
                        />
                    </CardContent>
                </Card>
            )}
            
            {/* 選択されたプレイリストがある場合にその詳細をロード */}
            {selectedPlaylistId && (
                <PlaylistDetailsLoader playlistId={selectedPlaylistId} userId={userId}/>
            )}
            
            {/* ユーザーがログインしている場合にフォローしているプレイリストを表示 */}
            {isLoggedIn && (
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            フォロー中のプレイリスト
                        </CardTitle>
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
