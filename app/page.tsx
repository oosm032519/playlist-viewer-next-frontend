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
        console.log("useEffect: URLフラグメントからJWTトークンを取得開始"); // 関数開始ログ
        const hash = window.location.hash;
        if (hash.startsWith('?token=')) {
            const token = hash.substring(7); // '#token=' の部分を削除
            localStorage.setItem('JWT', token);
            console.log("useEffect: JWTトークンをlocalStorageに保存しました"); // トークン保存ログ
            // トークンを取得したらフラグメントを削除
            window.history.replaceState({}, document.title, window.location.pathname);
            document.title = 'Playlist Viewer';
        } else {
            console.log("useEffect: URLフラグメントにJWTトークンは含まれていませんでした"); // トークン未取得ログ
        }
        console.log("useEffect: URLフラグメントからJWTトークンを取得終了"); // 関数終了ログ
    }, []);
    
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
