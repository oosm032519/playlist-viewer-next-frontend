// app/page.tsx

"use client";

import {Card, CardContent, CardHeader, CardTitle} from '@/app/components/ui/card';
import React, {useEffect, useState, useContext} from "react";
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
    const [showHeader, setShowHeader] = useState(true);
    const [searchQuery, setSearchQuery] = useState<string>(""); // 検索クエリを管理するステート
    let lastScrollY = 0;
    
    // お気に入りのプレイリストをフェッチ
    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);
    
    // スクロールイベントによるヘッダーの表示制御
    useEffect(() => {
        if (typeof window !== 'undefined') {
            lastScrollY = window.scrollY; // クライアントサイドでのみ実行
            const handleScroll = () => {
                if (window.scrollY > lastScrollY) {
                    setShowHeader(false);
                } else {
                    setShowHeader(true);
                }
                lastScrollY = window.scrollY;
            };
            
            window.addEventListener('scroll', handleScroll);
            
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);
    
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
     * @param {string} query - 検索クエリ
     */
    const handleSearch = (query: string) => {
        console.log("handleSearch: 検索クエリ", query);
        setSearchQuery(query); // 検索クエリをステートに保存
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
    
    const ThemeToggleButton = () => {
        const [mounted, setMounted] = useState(false);
        const {theme, setTheme} = useTheme();
        
        useEffect(() => {
            setMounted(true);
        }, []);
        
        if (!mounted) return null;
        
        return (
            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full"
            >
                {theme === 'dark' ? '🌞' : '🌙'}
            </button>
        );
    };
    
    return (
        <div className="w-full h-full max-w-none mx-auto pt-20 p-4 bg-background shadow-md rounded-lg">
            <div
                className={`fixed top-0 left-0 right-0 flex justify-between items-center bg-popover p-4 shadow-md z-10 transition-transform duration-300 ${showHeader ? 'transform-none' : '-translate-y-full'}`}>
                <LoginButton/>
                <h1 className="text-4xl font-bold text-primary">Playlist Viewer</h1>
                <ThemeToggleButton/>
            </div>
            <div className="space-y-6">
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">プレイリスト検索</CardTitle>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                </Card>
                
                {error && <ErrorAlert error={error}/>}
                
                <PlaylistDisplay
                    playlists={playlists}
                    userId={userId || undefined}
                    onPlaylistClick={handlePlaylistClick}
                    onSearchQuery={searchQuery}
                />
            </div>
            {isLoggedIn &&
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">お気に入り</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FavoritePlaylistsTable/>
                    </CardContent>
                </Card>
            }
        </div>
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
