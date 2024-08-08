"use client";

import React, {useEffect, useState, useContext} from "react";
import {Card, CardHeader, CardTitle, CardContent} from "./components/ui/card";
import PlaylistSearchForm from "./components/PlaylistSearchForm";
import PlaylistIdForm from "./components/PlaylistIdForm";
import LoginButton from "./components/LoginButton";
import {useUser, UserContextProvider} from "./context/UserContext";
import {PlaylistContextProvider, usePlaylist} from "./context/PlaylistContext";
import ErrorAlert from "./components/ErrorAlert";
import PlaylistDisplay from "./components/PlaylistDisplay";
import {Playlist} from "./types/playlist";
import {Toaster} from "@/app/components/ui/toaster";
import {FavoriteProvider, FavoriteContext} from '@/app/context/FavoriteContext'
import FavoritePlaylistsTable from '@/app/components/FavoritePlaylistsTable'

function HomeContent() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const {isLoggedIn, userId, error, setIsLoggedIn, setUserId} = useUser();
    const {setSelectedPlaylistId} = usePlaylist();
    const {fetchFavorites} = useContext(FavoriteContext);
    
    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);
    
    useEffect(() => {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const temporaryToken = params.get('token');
        
        if (temporaryToken) {
            fetch('/api/session/sessionId', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({temporaryToken}),
                credentials: 'include',
            })
                .then(response => response.json())
                .then(async (data) => {
                    if (data.sessionId) {
                        // セッションIDをCookieに保存
                        document.cookie = `sessionId=${data.sessionId}; path=/; SameSite=None; Secure`;
                        
                        // URLフラグメントを削除
                        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
                        
                        try {
                            // セッションチェックリクエストを送信
                            const response = await fetch('/api/session/check', {
                                credentials: 'include',
                            });
                            const sessionData = await response.json();
                            console.log("セッションチェック結果:", sessionData);
                            if (sessionData.status === 'success') {
                                setIsLoggedIn(true); // セッションチェック成功後に状態を更新
                                setUserId(sessionData.userId);
                            }
                        } catch (error) {
                            console.error('セッションチェックエラー:', error);
                        }
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    }, [setIsLoggedIn, setUserId]);
    
    const handleSearch = (playlists: Playlist[]) => {
        console.log("handleSearch: プレイリスト検索結果", playlists);
        setPlaylists(playlists);
        setSelectedPlaylistId(null);
    };
    
    const handlePlaylistClick = async (playlistId: string): Promise<void> => {
        console.log("handlePlaylistClick: 選択されたプレイリストID", playlistId);
        setSelectedPlaylistId(playlistId);
    };
    
    return (
        <main className="flex flex-col items-center justify-center p-8">
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle className="text-4xl font-bold text-center text-spotify-green">
                        Playlist Viewer
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <LoginButton/>
                        <PlaylistIdForm onPlaylistSelect={handlePlaylistClick}/>
                        <PlaylistSearchForm onSearch={handleSearch}/>
                        {error && <ErrorAlert error={error}/>}
                        <PlaylistDisplay
                            playlists={playlists}
                            userId={userId || undefined}
                            onPlaylistClick={handlePlaylistClick}
                        />
                    </div>
                    {isLoggedIn && <FavoritePlaylistsTable/>}
                </CardContent>
            </Card>
        </main>
    );
}

export default function Home() {
    return (
        <UserContextProvider>
            <PlaylistContextProvider>
                <FavoriteProvider>
                    <HomeContent/>
                    <Toaster/>
                </FavoriteProvider>
            </PlaylistContextProvider>
        </UserContextProvider>
    );
}
