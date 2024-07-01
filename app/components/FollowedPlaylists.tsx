// app/components/FollowedPlaylists.tsx
"use client";

import React, {useState, useEffect} from 'react';
import {Playlist} from '@/app/types/playlist';
import {Alert, AlertDescription, AlertTitle} from "./ui/alert";
import LoadingSpinner from "./LoadingSpinner";

interface FollowedPlaylistsProps {
    onPlaylistClick: (playlistId: string) => void;
}

// プレイリストデータを取得する処理をfetchFollowedPlaylists関数として抽出
const fetchFollowedPlaylists = async () => {
    try {
        const response = await fetch('/api/playlists/followed', {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        return await response.json();
    } catch (err) {
        console.error("FollowedPlaylists: エラーが発生しました", err);
        throw new Error('フォロー中のプレイリストの取得中にエラーが発生しました。');
    }
};

const FollowedPlaylists: React.FC<FollowedPlaylistsProps> = ({onPlaylistClick}) => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        // fetchFollowedPlaylists関数を呼び出し、結果を処理
        fetchFollowedPlaylists()
            .then(data => {
                setPlaylists(data);
            })
            .catch(error => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    
    if (loading) {
        return <LoadingSpinner loading={loading}/>;
    }
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }
    
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">フォロー中のプレイリスト</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {playlists.map((playlist) => (
                    <li key={playlist.id} className="bg-gray-100 p-4 rounded-lg shadow">
                        <div onClick={() => onPlaylistClick(playlist.id)}>
                            {playlist.images && playlist.images.length > 0 && (
                                <img src={playlist.images[0].url} alt={playlist.name}
                                     className="w-full h-40 object-cover mb-2 rounded-full cursor-pointer"/>
                            )}
                            <h3 className="font-semibold cursor-pointer">{playlist.name}</h3>
                            <p className="text-sm text-gray-600">トラック数: {playlist.tracks.total}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FollowedPlaylists;