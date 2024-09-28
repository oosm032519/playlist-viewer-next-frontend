// app/components/PlaylistDisplay.tsx

import LoadingSpinner from "@/app/components/LoadingSpinner";
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
    PaginationEllipsis,
} from "@/app/components/ui/pagination";

interface PlaylistDisplayProps {
    playlists: Playlist[];
    userId: string | undefined;
    onPlaylistClick: (playlistId: string) => void;
    onSearchQuery: string;
}

const PlaylistDisplay: React.FC<PlaylistDisplayProps> = ({
                                                             userId,
                                                             onPlaylistClick,
                                                             onSearchQuery,
                                                         }) => {
    const {isLoggedIn} = useUser();
    const {selectedPlaylistId} = usePlaylist();
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPlaylists, setCurrentPlaylists] = useState<Playlist[]>([]);
    const [totalPlaylists, setTotalPlaylists] = useState(0);
    const queryClient = useQueryClient();
    
    const searchMutation = useSearchPlaylists((data) => {
        setCurrentPlaylists(data.playlists);
        setTotalPlaylists(data.total);
    });
    
    useEffect(() => {
        setCurrentPage(1);
        // onSearchQuery が空文字列でない場合のみAPIリクエストを実行
        if (onSearchQuery !== "") {
            searchMutation.mutate({query: onSearchQuery, page: 1, limit: 20});
        }
    }, [onSearchQuery]);
    
    const handleNextPage = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        
        const cachedData = queryClient.getQueryData([
            "playlists",
            onSearchQuery,
            nextPage,
        ]) as { playlists: Playlist[]; total: number } | undefined;
        
        if (cachedData) {
            setCurrentPlaylists(cachedData.playlists);
            setTotalPlaylists(cachedData.total);
        } else {
            searchMutation.mutate({
                query: onSearchQuery,
                page: nextPage,
                limit: 20,
            });
        }
    };
    
    const handlePrevPage = () => {
        const prevPage = currentPage - 1;
        setCurrentPage(prevPage);
        
        const cachedData = queryClient.getQueryData([
            "playlists",
            onSearchQuery,
            prevPage,
        ]) as { playlists: Playlist[]; total: number } | undefined;
        
        if (cachedData) {
            setCurrentPlaylists(cachedData.playlists);
            setTotalPlaylists(cachedData.total);
        } else {
            searchMutation.mutate({
                query: onSearchQuery,
                page: prevPage,
                limit: 20,
            });
        }
    };
    
    // ページ数を計算
    const totalPages = Math.ceil(totalPlaylists / 20);
    
    // 指定したページに移動する関数
    const goToPage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        
        const cachedData = queryClient.getQueryData([
            "playlists",
            onSearchQuery,
            pageNumber,
        ]) as { playlists: Playlist[]; total: number } | undefined;
        
        if (cachedData) {
            setCurrentPlaylists(cachedData.playlists);
            setTotalPlaylists(cachedData.total);
        } else {
            searchMutation.mutate({
                query: onSearchQuery,
                page: pageNumber,
                limit: 20,
            });
        }
    };
    
    return (
        <>
            <LoadingSpinner loading={searchMutation.isPending}/>
            {currentPlaylists.length > 0 && !selectedPlaylistId && (
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">検索結果</CardTitle>
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
                                {[...Array(totalPages).keys()].slice(Math.max(currentPage - 2, 0), Math.min(currentPage + 1, totalPages)).map(page => (
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
                    </CardContent>
                </Card>
            )}
            
            {selectedPlaylistId && (
                <PlaylistDetailsLoader playlistId={selectedPlaylistId} userId={userId}/>
            )}
            
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
