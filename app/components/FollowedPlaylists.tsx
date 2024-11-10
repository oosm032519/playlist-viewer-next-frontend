// app/components/FollowedPlaylists.tsx

import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {Playlist} from '@/app/types/playlist';
import {Alert, AlertDescription, AlertTitle} from "@/app/components/ui/alert";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import DOMPurify from 'dompurify';
import Image from "next/image";

/**
 * FollowedPlaylistsコンポーネントのプロパティ
 * @property onPlaylistClick - プレイリストがクリックされたときに呼び出される関数
 */
interface FollowedPlaylistsProps {
    onPlaylistClick: (playlistId: string) => void;
}

/**
 * フォロー中のプレイリストをAPIから取得する非同期関数
 * @returns {Promise<Playlist[]>} プレイリストの配列を返すPromise
 * @throws APIリクエストが失敗した場合にエラーをスロー
 */
const fetchFollowedPlaylists = async (): Promise<Playlist[]> => {
    const playlistsResponse = await fetch('/api/playlists/followed', {
        credentials: 'include',
    });
    
    if (!playlistsResponse.ok) {
        throw new Error(`API request failed with status ${playlistsResponse.status}`);
    }
    
    const data = await playlistsResponse.json();
    return Array.isArray(data) ? data : data.items || [];
};

/**
 * フォロー中のプレイリストを表示するコンポーネント
 * @param {FollowedPlaylistsProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} フォロー中のプレイリストを表示するJSX要素
 */
const FollowedPlaylists: React.FC<FollowedPlaylistsProps> = ({onPlaylistClick}) => {
    const {data: playlists, isLoading, error} = useQuery<Playlist[], Error>({
        queryKey: ['followedPlaylists'],
        queryFn: fetchFollowedPlaylists,
    });
    
    if (isLoading) {
        return <LoadingSpinner loading={isLoading}/>;
    }
    
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
            </Alert>
        );
    }
    
    return (
        <div>
            {playlists && playlists.length === 0 ? (
                <p>フォロー中のプレイリストはありません。</p>
            ) : (
                <ul className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
                    {playlists && playlists.map((playlist) => {
                        const sanitizedName = DOMPurify.sanitize(playlist.name);
                        const sanitizedImageUrl = playlist.images && playlist.images.length > 0
                            ? DOMPurify.sanitize(playlist.images[0].url)
                            : '';
                        const sanitizedTrackCount = DOMPurify.sanitize(playlist.tracks.total.toString());
                        
                        return (
                            <li key={playlist.id} className="bg-gray-100 p-4 rounded-lg shadow">
                                <div onClick={() => onPlaylistClick(playlist.id)}>
                                    {sanitizedImageUrl ? (
                                        <Image
                                            src={sanitizedImageUrl}
                                            alt={sanitizedName}
                                            className="w-auto h-auto mb-2 cursor-pointer"
                                            width={640}
                                            height={640}
                                        />
                                    ) : (
                                        <div className="w-full h-auto bg-gray-200 flex items-center justify-center mb-2"
                                             style={{maxWidth: '100%'}}>
                                            <span className="text-gray-500">No Image</span>
                                        </div>
                                    )}
                                    <h3 className="font-semibold cursor-pointer text-black">
                                        {sanitizedName}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        トラック数: {sanitizedTrackCount}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default FollowedPlaylists;
