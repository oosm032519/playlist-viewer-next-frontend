// app/page.tsx
"use client";

import React, {useEffect, useState} from "react";
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
import {FavoriteProvider} from '@/app/context/FavoriteContext'
import FavoritePlaylistsTable from '@/app/components/FavoritePlaylistsTable'

function HomeContent() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const {isLoggedIn, userId, error} = useUser();
    const {setSelectedPlaylistId} = usePlaylist();
    
    const handleSearch = (playlists: Playlist[]) => {
        console.log("handleSearch: プレイリスト検索結果", playlists); // 検索結果をログ出力
        setPlaylists(playlists);
        setSelectedPlaylistId(null);
    };
    
    // URLフラグメントからJWTトークンを取得
    useEffect(() => {
        console.log("トークンの取得処理を開始します"); // トークンの取得処理を開始
        const urlParams = new URLSearchParams(window.location.search);
        console.log("URLパラメータ", urlParams); // URLパラメータをログ出力
        const token = urlParams.get('token');
        console.log("JWTトークン", token); // トークンをログ出力
        if (token) {
            console.log("トークンをセッションストレージに保存します"); // トークンをセッションストレージに保存
            localStorage.setItem('JWT', token);
            console.log("トークンをセッションストレージに保存しました"); // トークンをセッションストレージに保存
            // トークンを取得したらクエリパラメータを削除
            console.log("クエリパラメータを削除します"); // クエリパラメータを削除
            window.history.replaceState({}, document.title, window.location.pathname);
            console.log("クエリパラメータを削除しました"); // クエリパラメータを削除
        }
        console.log("トークンの取得処理が完了しました"); // トークンの取得処理が完了
    }, [window.location.search]);
    
    const handlePlaylistClick = async (playlistId: string): Promise<void> => {
        console.log("handlePlaylistClick: 選択されたプレイリストID", playlistId); // プレイリストIDログ
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
                        {error && <ErrorAlert error={error}/>} {/* エラー発生時にエラー内容をログ出力 */}
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
