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
        const data = await response.json();
        // APIレスポンスの構造に応じて適切に処理
        return Array.isArray(data) ? data : data.items || [];
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
        let isMounted = true;
        fetchFollowedPlaylists()
            .then(data => {
                if (isMounted) {
                    setPlaylists(data);
                }
            })
            .catch(error => {
                if (isMounted) {
                    setError(error.message);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });
        
        return () => {
            isMounted = false;
        };
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
            {playlists.length === 0 ? (
                <p>フォロー中のプレイリストはありません。</p>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {playlists.map((playlist) => (
                    <li key={playlist.id} className="bg-gray-100 p-4 rounded-lg shadow">
                        <div onClick={() => onPlaylistClick(playlist.id)}>
                            {playlist.images && playlist.images.length > 0 ? (
                                <img
                                    src={playlist.images[0].url}
                                    alt={playlist.name}
                                    className="w-full h-40 object-cover mb-2 rounded-full cursor-pointer"
                                />
                            ) : (
                                <div
                                    className="w-full h-40 bg-gray-200 flex items-center justify-center mb-2 rounded-full">
                                    <span className="text-gray-500">No Image</span>
                                </div>
                            )}
                            <h3 className="font-semibold cursor-pointer">{playlist.name}</h3>
                            <p className="text-sm text-gray-600">トラック数: {playlist.tracks.total}</p>
                        </div>
                    </li>
                ))}
                </ul>
            )}
        </div>
    );
};

export default FollowedPlaylists;
