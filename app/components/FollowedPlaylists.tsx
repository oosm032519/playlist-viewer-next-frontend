// app/components/FollowedPlaylists.tsx
"use client";

import React, {useState, useEffect} from 'react';
import {Playlist} from '@/app/types/playlist';
import {Alert, AlertDescription, AlertTitle} from "./ui/alert";
import LoadingSpinner from "./LoadingSpinner";
import axios from 'axios';
import {Track} from "@/app/types/track";
import PlaylistDetails from "@/app/components/PlaylistDetails";

const FollowedPlaylists: React.FC = () => {
    console.log("FollowedPlaylists コンポーネントがレンダリングされました");
    
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState<Track[]>([]);
    const [showPlaylistDetails, setShowPlaylistDetails] = useState(false);
    const [genreCounts, setGenreCounts] = useState<{ [genre: string]: number }>({});
    const [recommendations, setRecommendations] = useState<Track[]>([]);
    const [selectedPlaylistName, setSelectedPlaylistName] = useState<string | null>(null);
    
    useEffect(() => {
        console.log("FollowedPlaylists: useEffect が実行されました");
        const fetchFollowedPlaylists = async () => {
            console.log("FollowedPlaylists: フォロー中のプレイリストの取得を開始します");
            try {
                const response = await fetch('/api/playlists/followed', {
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    throw new Error('API request failed');
                }
                const data = await response.json();
                console.log("FollowedPlaylists: API レスポンス:", data);
                setPlaylists(data);
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
    
    const handlePlaylistClick = async (playlistId: string, playlistName: string) => {
        console.log("Playlist clicked:", playlistId);
        setSelectedPlaylistName(playlistName);
        try {
            const response = await axios.get(`/api/playlists/${playlistId}`);
            console.log("Playlist details:", response.data);
            
            setSelectedPlaylistTracks(response.data.tracks.items.map((item: any) => ({
                ...item.track,
                audioFeatures: item.audioFeatures
            })));
            setShowPlaylistDetails(true);
            setGenreCounts(response.data.genreCounts);
            setRecommendations(response.data.recommendations);
        } catch (error) {
            console.error("Error fetching playlist details:", error);
        }
    };
    
    console.log("FollowedPlaylists: 現在の状態", {playlists, loading, error});
    
    if (loading) {
        console.log("FollowedPlaylists: ローディング中");
        return <LoadingSpinner loading={loading}/>;
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
                    <li key={playlist.id} className="bg-gray-100 p-4 rounded-lg shadow cursor-pointer"
                        onClick={() => handlePlaylistClick(playlist.id, playlist.name)}>
                        {playlist.images && playlist.images.length > 0 && (
                            <img src={playlist.images[0].url} alt={playlist.name}
                                 className="w-full h-40 object-cover mb-2 rounded-full"/>
                        )}
                        <h3 className="font-semibold">{playlist.name}</h3>
                        <p className="text-sm text-gray-600">トラック数: {playlist.tracks.total}</p>
                    </li>
                ))}
            </ul>
            
            {showPlaylistDetails && (
                <div className="mt-8">
                    <PlaylistDetails
                        tracks={selectedPlaylistTracks}
                        genreCounts={genreCounts}
                        recommendations={recommendations}
                        playlistName={selectedPlaylistName}
                    />
                </div>
            )}
        </div>
    );
};

export default FollowedPlaylists;
