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

export default function Home() {
    console.log("Home コンポーネントがレンダリングされました");
    
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    
    const searchParams = useSearchParams();
    
    useEffect(() => {
        console.log("Home: useEffect が実行されました");
        const loginSuccess = searchParams.get('loginSuccess');
        const userIdParam = searchParams.get('userId');
        
        if (loginSuccess === 'true' && userIdParam) {
            setIsLoggedIn(true);
            setUserId(userIdParam);
            console.log("ログイン成功。ユーザーID:", userIdParam);
        }
        
        console.log("現在の playlists の状態:", playlists);
        console.log("現在の error の状態:", error);
        console.log("現在の isLoggedIn の状態:", isLoggedIn);
        console.log("現在の userId の状態:", userId);
    }, [searchParams, playlists, error]);
    
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
            
            {playlists.length > 0 && <PlaylistTable playlists={playlists}/>}
            
            {isLoggedIn && <FollowedPlaylists/>}
        </main>
    );
}
