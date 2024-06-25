"use client";

import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Playlist} from '@/app/types/playlist';
import {Alert, AlertDescription, AlertTitle} from "./ui/alert";

const FollowedPlaylists: React.FC = () => {
    console.log("FollowedPlaylists コンポーネントがレンダリングされました");
    
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        console.log("FollowedPlaylists: useEffect が実行されました");
        const fetchFollowedPlaylists = async () => {
            console.log("FollowedPlaylists: フォロー中のプレイリストの取得を開始します");
            try {
                const response = await axios.get('http://localhost:8080/api/playlists/followed', {
                    withCredentials: true
                });
                console.log("FollowedPlaylists: API レスポンス:", response.data);
                setPlaylists(response.data);
                setLoading(false);
                console.log("FollowedPlaylists: プレイリストの状態を更新し、ローディングを false に設定しました");
            } catch (err) {
                console.error("FollowedPlaylists: エラーが発生しました", err);
                setError('フォロー中のプレイリストの取得中にエラーが発生しました。');
                setLoading(false);
            }
        };
        
        fetchFollowedPlaylists();
    }, []);
    
    console.log("FollowedPlaylists: 現在の状態", {playlists, loading, error});
    
    if (loading) {
        console.log("FollowedPlaylists: ローディング中");
        return <div>読み込み中...</div>;
    }
    if (error) {
        console.log("FollowedPlaylists: エラー状態");
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }
    
    console.log("FollowedPlaylists: プレイリスト一覧をレンダリングします");
    
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">フォロー中のプレイリスト</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {playlists.map((playlist) => (
                    <li key={playlist.id} className="bg-gray-100 p-4 rounded-lg shadow">
                        {playlist.images && playlist.images.length > 0 && (
                            <img src={playlist.images[0].url} alt={playlist.name}
                                 className="w-full h-40 object-cover mb-2 rounded"/>
                        )}
                        <h3 className="font-semibold">{playlist.name}</h3>
                        <p className="text-sm text-gray-600">トラック数: {playlist.tracks.total}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FollowedPlaylists;
