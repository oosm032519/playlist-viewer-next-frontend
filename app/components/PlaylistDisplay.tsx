// app/components/PlaylistDisplay.tsx

import LoadingSpinner from "@/app/components/LoadingSpinner";
import {Card, CardContent, CardHeader, CardTitle} from "@/app/components/ui/card";
import React, {useState, useEffect} from "react";
import PlaylistTable from "@/app/components/PlaylistTable";
import PlaylistDetailsLoader from "@/app/components/PlaylistDetailsLoader";
import FollowedPlaylists from "@/app/components/FollowedPlaylists";
import {Playlist} from "@/app/types/playlist";
import {useUser} from "@/app/context/UserContext";
import {usePlaylist} from "@/app/context/PlaylistContext";
import {useQueryClient} from "@tanstack/react-query";
import {useSearchPlaylists} from "@/app/hooks/useSearchPlaylists";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/app/components/ui/pagination";

/**
 * プレイリストを表示するためのコンポーネント。
 *
 * @param playlists プレイリストのリスト
 * @param userId ログインユーザーのID
 * @param onPlaylistClick プレイリストがクリックされた際に呼び出される関数
 * @param onSearchQuery 検索クエリ
 */
interface PlaylistDisplayProps {
    playlists: Playlist[];
    userId: string | undefined;
    onPlaylistClick: (playlistId: string) => void;
    onSearchQuery: string;
}

/**
 * プレイリストの検索結果やフォロー中のプレイリストを表示するコンポーネント。
 * ページネーションや検索機能を含み、選択されたプレイリストの詳細も表示可能。
 *
 * @param {PlaylistDisplayProps} props プレイリスト表示に必要なプロパティ
 * @returns JSX.Element プレイリスト表示コンポーネント
 */
const PlaylistDisplay: React.FC<PlaylistDisplayProps> = ({
                                                             userId,
                                                             onPlaylistClick,
                                                             onSearchQuery,
                                                         }) => {
    const {isLoggedIn} = useUser(); // ユーザーがログインしているかどうか
    const {selectedPlaylistId} = usePlaylist(); // 選択されたプレイリストID
    const [currentPage, setCurrentPage] = useState(1); // 現在のページ番号
    const [currentPlaylists, setCurrentPlaylists] = useState<Playlist[]>([]); // 現在表示されているプレイリスト
    const [totalPlaylists, setTotalPlaylists] = useState(0); // 総プレイリスト数
    const queryClient = useQueryClient(); // React Queryのクエリクライアント
    
    // 検索結果の取得に使用するMutation
    const searchMutation = useSearchPlaylists((data) => {
        setCurrentPlaylists(data.playlists); // プレイリストを更新
        setTotalPlaylists(data.total); // 総プレイリスト数を更新
    });
    
    // 検索クエリが変更されたら、ページをリセットして検索を実行
    useEffect(() => {
        setCurrentPage(1);
        if (onSearchQuery !== "") {
            searchMutation.mutate({query: onSearchQuery, page: 1, limit: 20});
        }
    }, [onSearchQuery]);
    
    /**
     * 次のページに移動する関数
     */
    const handleNextPage = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        
        // 次のページのデータがキャッシュされているかチェック
        const cachedData = queryClient.getQueryData([
            "playlists",
            onSearchQuery,
            nextPage,
        ]) as { playlists: Playlist[]; total: number } | undefined;
        
        if (cachedData) {
            // キャッシュがあればそれを使用
            setCurrentPlaylists(cachedData.playlists);
            setTotalPlaylists(cachedData.total);
        } else {
            // キャッシュがなければAPIリクエスト
            searchMutation.mutate({
                query: onSearchQuery,
                page: nextPage,
                limit: 20,
            });
        }
    };
    
    /**
     * 前のページに移動する関数
     */
    const handlePrevPage = () => {
        const prevPage = currentPage - 1;
        setCurrentPage(prevPage);
        
        // 前のページのデータがキャッシュされているかチェック
        const cachedData = queryClient.getQueryData([
            "playlists",
            onSearchQuery,
            prevPage,
        ]) as { playlists: Playlist[]; total: number } | undefined;
        
        if (cachedData) {
            // キャッシュがあればそれを使用
            setCurrentPlaylists(cachedData.playlists);
            setTotalPlaylists(cachedData.total);
        } else {
            // キャッシュがなければAPIリクエスト
            searchMutation.mutate({
                query: onSearchQuery,
                page: prevPage,
                limit: 20,
            });
        }
    };
    
    // 総ページ数の計算
    const totalPages = Math.ceil(totalPlaylists / 20);
    
    /**
     * 特定のページに移動する関数
     *
     * @param pageNumber 移動したいページ番号
     */
    const goToPage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        
        // 指定されたページのデータがキャッシュされているかチェック
        const cachedData = queryClient.getQueryData([
            "playlists",
            onSearchQuery,
            pageNumber,
        ]) as { playlists: Playlist[]; total: number } | undefined;
        
        if (cachedData) {
            // キャッシュがあればそれを使用
            setCurrentPlaylists(cachedData.playlists);
            setTotalPlaylists(cachedData.total);
        } else {
            // キャッシュがなければAPIリクエスト
            searchMutation.mutate({
                query: onSearchQuery,
                page: pageNumber,
                limit: 20,
            });
        }
    };
    
    return (
        <>
            {/* ローディングスピナーを表示 */}
            <LoadingSpinner loading={searchMutation.isPending}/>
            
            {/* プレイリストが存在し、選択されたプレイリストがない場合に表示 */}
            {currentPlaylists.length > 0 && !selectedPlaylistId && (
                <Card className="mt-4 border-border border-2">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">検索結果</CardTitle>
                        {/* ページネーション（上部） */}
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={currentPage > 1 ? handlePrevPage : undefined}
                                    />
                                </PaginationItem>
                                {currentPage > 2 && (
                                    <PaginationItem>
                                        <PaginationLink href="#" onClick={() => goToPage(1)}>
                                            1
                                        </PaginationLink>
                                    </PaginationItem>
                                )}
                                {currentPage > 3 && (
                                    <PaginationItem>
                                        <PaginationEllipsis/>
                                    </PaginationItem>
                                )}
                                {[...Array(totalPages).keys()]
                                    .slice(Math.max(currentPage - 2, 0), Math.min(currentPage + 1, totalPages))
                                    .map(page => (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                href="#"
                                                isActive={page + 1 === currentPage}
                                                onClick={() => goToPage(page + 1)}
                                            >
                                                {page + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                {currentPage < totalPages - 2 && (
                                    <PaginationItem>
                                        <PaginationEllipsis/>
                                    </PaginationItem>
                                )}
                                {currentPage < totalPages - 1 && (
                                    <PaginationItem>
                                        <PaginationLink href="#" onClick={() => goToPage(totalPages)}>
                                            {totalPages}
                                        </PaginationLink>
                                    </PaginationItem>
                                )}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={currentPage * 20 < totalPlaylists ? handleNextPage : undefined}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </CardHeader>
                    <CardContent>
                        <PlaylistTable
                            playlists={currentPlaylists}
                            onPlaylistClick={onPlaylistClick}
                            totalPlaylists={totalPlaylists}
                            currentPage={currentPage}
                        />
                        {/* ページネーション（下部） */}
                        <Pagination className="mt-4">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={currentPage > 1 ? handlePrevPage : undefined}
                                    />
                                </PaginationItem>
                                {currentPage > 2 && (
                                    <PaginationItem>
                                        <PaginationLink href="#" onClick={() => goToPage(1)}>
                                            1
                                        </PaginationLink>
                                    </PaginationItem>
                                )}
                                {currentPage > 3 && (
                                    <PaginationItem>
                                        <PaginationEllipsis/>
                                    </PaginationItem>
                                )}
                                {[...Array(totalPages).keys()]
                                    .slice(Math.max(currentPage - 2, 0), Math.min(currentPage + 1, totalPages))
                                    .map(page => (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                href="#"
                                                isActive={page + 1 === currentPage}
                                                onClick={() => goToPage(page + 1)}
                                            >
                                                {page + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                {currentPage < totalPages - 2 && (
                                    <PaginationItem>
                                        <PaginationEllipsis/>
                                    </PaginationItem>
                                )}
                                {currentPage < totalPages - 1 && (
                                    <PaginationItem>
                                        <PaginationLink href="#" onClick={() => goToPage(totalPages)}>
                                            {totalPages}
                                        </PaginationLink>
                                    </PaginationItem>
                                )}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={currentPage * 20 < totalPlaylists ? handleNextPage : undefined}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </CardContent>
                </Card>
            )}
            
            {/* 選択されたプレイリストの詳細を表示 */}
            {selectedPlaylistId && (
                <PlaylistDetailsLoader playlistId={selectedPlaylistId} userId={userId}/>
            )}
            
            {/* ログイン中のユーザーにフォロー中のプレイリストを表示 */}
            {isLoggedIn && (
                <Card className="mt-4 border-border border-2">
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
