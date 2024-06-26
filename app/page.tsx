"use client";

import {useState, useEffect} from "react";
import {useSearchParams} from 'next/navigation';
import PlaylistSearchForm from "./components/PlaylistSearchForm";
import PlaylistTable from "./components/PlaylistTable";
import {Playlist} from "@/app/types/playlist";
import {Alert, AlertDescription, AlertTitle} from "./components/ui/alert";
import PlaylistIdForm from "./components/PlaylistIdForm";
import LoginButton from "./components/LoginButton";
import FollowedPlaylists from "./components/FollowedPlaylists";
import axios from 'axios'
import {Track} from "@/app/types/track";
import {PlaylistDetailsTable} from "./components/PlaylistDetailsTable";

export default function Home() {
    console.log("Home コンポーネントがレンダリングされました");
    
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [, setUserId] = useState<string | null>(null);
    const [sessionCheckResult, setSessionCheckResult] = useState('');
    const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState<Track[]>([]);
    const [showPlaylistDetails, setShowPlaylistDetails] = useState(false); // プレイリスト詳細の表示状態
    
    useSearchParams()
    useEffect(() => {
        const intervalId = setInterval(async () => {
            try {
                console.log("セッションチェックを実行します");
                const response = await axios.get('http://localhost:8080/api/session/check', {
                    withCredentials: true
                });
                setSessionCheckResult(JSON.stringify(response.data, null, 2));
            } catch (error) {
                console.error('セッションチェックエラー:', error);
                setSessionCheckResult('Error checking session');
            }
        }, 10000);
        
        return () => clearInterval(intervalId);
    }, []);
    
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/session/check', {withCredentials: true});
                if (response.data.status === 'success') {
                    setIsLoggedIn(true);
                    setUserId(response.data.userId);
                }
            } catch (error) {
                console.error('セッションチェックエラー:', error);
            }
        };
        
        checkSession();
    }, []);
    
    const handleSearch = (playlists: Playlist[]) => {
        console.log("handleSearch 関数が呼び出されました");
        console.log("受け取った playlists:", playlists);
        
        setPlaylists(playlists);
        console.log("playlists の状態を更新しました");
        setError(null);
        console.log("error の状態をクリアしました");
        setShowPlaylistDetails(false); // プレイリスト検索時は詳細を非表示にする
    };
    
    const handleLoginSuccess = () => {
        console.log("handleLoginSuccess 関数が呼び出されました");
        setIsLoggedIn(true);
        console.log("isLoggedIn の状態を true に更新しました");
    };
    
    const handlePlaylistClick = async (playlistId: string) => {
        console.log("Playlist clicked:", playlistId);
        try {
            const response = await axios.get(`/api/playlists/${playlistId}`);
            console.log("Playlist details:", response.data);
            
            setSelectedPlaylistTracks(response.data.tracks.items.map((item: any) => ({
                ...item.track,
                audioFeatures: item.audioFeatures
            })));
            setShowPlaylistDetails(true); // プレイリスト詳細を表示する
        } catch (error) {
            console.error("Error fetching playlist details:", error);
        }
    };
    
    console.log("Home: JSX をレンダリングします");
    
    return (
        <main className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-8 text-spotify-green">
                Playlist Viewer
            </h1>
            <LoginButton onLoginSuccess={handleLoginSuccess}/>
            <PlaylistSearchForm onSearch={handleSearch}/>
            <PlaylistIdForm/>
            
            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            
            <div className="mt-8">
                <pre>{sessionCheckResult}</pre>
            </div>
            
            {/* プレイリスト詳細の表示状態によって表示を切り替える */}
            {!showPlaylistDetails && playlists.length > 0 &&
                <PlaylistTable playlists={playlists} onPlaylistClick={handlePlaylistClick}/>}
            
            {showPlaylistDetails && selectedPlaylistTracks.length > 0 &&
                <div className="overflow-x-auto, w-full">
                    <PlaylistDetailsTable tracks={selectedPlaylistTracks}/>
                </div>}
            
            {isLoggedIn && <FollowedPlaylists/>}
                </main>
                );
            }
