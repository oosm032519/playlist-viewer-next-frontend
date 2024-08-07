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
import TestCookie from '@/app/components/TestCookie'
import {useRouter} from 'next/navigation'

function HomeContent() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const {isLoggedIn, userId, error, setIsLoggedIn} = useUser();
    const {setSelectedPlaylistId} = usePlaylist();
    const router = useRouter();
    
    useEffect(() => {
        const hash = window.location.hash;
        if (hash.startsWith('#token=')) {
            const token = hash.substring(7);
            fetchSessionId(token);
        }
    }, []);
    
    const fetchSessionId = async (token: string) => {
        try {
            const response = await fetch('/api/session/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token}),
            });
            
            if (response.ok) {
                setIsLoggedIn(true);
                router.replace('/'); // URLからトークンを削除
            } else {
                console.error('Failed to fetch session ID');
            }
        } catch (error) {
            console.error('Error fetching session ID:', error);
        }
    };
    
    const handleSearch = (playlists: Playlist[]) => {
        console.log("handleSearch: プレイリスト検索結果", playlists); // 検索結果をログ出力
        setPlaylists(playlists);
        setSelectedPlaylistId(null);
    };
    
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
                        <TestCookie/> {/* 追加 */}
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
