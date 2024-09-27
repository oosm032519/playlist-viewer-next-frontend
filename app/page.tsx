// app/page.tsx

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
import {FavoriteProvider, FavoriteContext} from '@/app/context/FavoriteContext';
import FavoritePlaylistsTable from '@/app/components/FavoritePlaylistsTable';
import {useTheme} from 'next-themes';
import {Tabs, TabsList, TabsTrigger, TabsContent} from "./components/ui/tabs";

/**
 * HomeContentコンポーネント
 *
 * @returns {JSX.Element} - メインコンテンツをレンダリングするReactコンポーネント
 */
function HomeContent(): JSX.Element {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const {isLoggedIn, userId, error, setIsLoggedIn, setUserId} = useUser();
    const {theme, setTheme} = useTheme();
    const {setSelectedPlaylistId} = usePlaylist();
    const {fetchFavorites} = useContext(FavoriteContext);
    const [activeTab, setActiveTab] = useState('playlistId');
    
    // お気に入りのプレイリストをフェッチ
    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);
    
    // URLのハッシュからトークンを取得し、セッションを確立
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
    }, []);
    
    /**
     * プレイリスト検索結果を処理
     *
     * @param {Playlist[]} playlists - 検索結果のプレイリスト
     */
    const handleSearch = (playlists: Playlist[]) => {
        console.log("handleSearch: プレイリスト検索結果", playlists);
        setPlaylists(playlists);
        setSelectedPlaylistId(null);
    };
    
    /**
     * プレイリストがクリックされたときの処理
     *
     * @param {string} playlistId - 選択されたプレイリストのID
     * @returns {Promise<void>}
     */
    const handlePlaylistClick = async (playlistId: string): Promise<void> => {
        console.log("handlePlaylistClick: 選択されたプレイリストID", playlistId);
        setSelectedPlaylistId(playlistId);
    };
    
    return (
        <Card
            className="w-full h-full max-w-none mx-auto">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <LoginButton/>
                    <CardTitle className="text-4xl font-bold">
                        Playlist Viewer
                    </CardTitle>
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 rounded-full"
                    >
                        {theme === 'dark' ? '🌞' : '🌙'}
                    </button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <Tabs defaultValue="playlistId" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="playlistId">URLで検索</TabsTrigger>
                            <TabsTrigger value="playlistSearch">プレイリスト名で検索</TabsTrigger>
                        </TabsList>
                        <TabsContent value="playlistId">
                            <PlaylistIdForm onPlaylistSelect={handlePlaylistClick}/>
                        </TabsContent>
                        <TabsContent value="playlistSearch">
                            <PlaylistSearchForm onSearch={handleSearch}/>
                        </TabsContent>
                    </Tabs>
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
    );
}

/**
 * Homeコンポーネント
 *
 * @returns {JSX.Element} - アプリケーションのホームページをレンダリングするReactコンポーネント
 */
export default function Home(): JSX.Element {
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
