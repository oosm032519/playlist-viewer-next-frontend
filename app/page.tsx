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

export default function Home() {
    console.log("Home コンポーネントがレンダリングされました");
    
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [sessionCheckResult, setSessionCheckResult] = useState('');
    
    const searchParams = useSearchParams();
    
    useEffect(() => {
        const intervalId = setInterval(async () => {
            try {
                console.log("セッションチェックを実行します");
                const response = await axios.get('http://localhost:8080/api/session/check', {
                    withCredentials: true // クッキーなどの資格情報の送信を有効にする
                });
                setSessionCheckResult(JSON.stringify(response.data, null, 2));
            } catch (error) {
                console.error('セッションチェックエラー:', error);
                setSessionCheckResult('Error checking session');
            }
        }, 10000); // 10秒ごとに実行
        
        return () => clearInterval(intervalId); // クリーンアップ
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
    };
    
    const handleLoginSuccess = () => {
        console.log("handleLoginSuccess 関数が呼び出されました");
        setIsLoggedIn(true);
        console.log("isLoggedIn の状態を true に更新しました");
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
            
            {playlists.length > 0 && <PlaylistTable playlists={playlists}/>}
            
            {isLoggedIn && <FollowedPlaylists/>}
        </main>
    );
}
