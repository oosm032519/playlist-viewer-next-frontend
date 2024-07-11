// app/components/FollowedPlaylists.tsx
"use client";

import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {Playlist} from '../types/playlist';
import {Alert, AlertDescription, AlertTitle} from "./ui/alert";
import LoadingSpinner from "./LoadingSpinner";

interface FollowedPlaylistsProps {
    onPlaylistClick: (playlistId: string) => void;
}

/**
 * フォロー中のプレイリストデータをAPIから取得する非同期関数
 * @returns {Promise<Playlist[]>} プレイリストの配列を返す
 * @throws {Error} APIリクエストが失敗した場合にエラーを投げる
 */
const fetchFollowedPlaylists = async (): Promise<Playlist[]> => {
    const response = await fetch('/api/playlists/followed', {
        credentials: 'include'
    });
    
    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : data.items || [];
};

/**
 * フォロー中のプレイリストを表示するコンポーネント
 * @param {FollowedPlaylistsProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} フォロー中のプレイリストを表示するJSX要素
 */
const FollowedPlaylists: React.FC<FollowedPlaylistsProps> = ({onPlaylistClick}) => {
    // React Queryを使用してフォロー中のプレイリストデータを取得
    const {data: playlists, isLoading, error} = useQuery<Playlist[], Error>({
        queryKey: ['followedPlaylists'],
        queryFn: fetchFollowedPlaylists,
    });
    
    // データがロード中の場合、ローディングスピナーを表示
    if (isLoading) {
        return <LoadingSpinner loading={isLoading}/>;
    }
    
    // エラーが発生した場合、エラーメッセージを表示
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
            </Alert>
        );
    }
    
    // フォロー中のプレイリストを表示
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">フォロー中のプレイリスト</h2>
            {playlists && playlists.length === 0 ? (
                <p>フォロー中のプレイリストはありません。</p>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {playlists && playlists.map((playlist) => (
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
