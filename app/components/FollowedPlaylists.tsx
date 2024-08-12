// app/components/FollowedPlaylists.tsx

import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {Playlist} from '../types/playlist';
import {Alert, AlertDescription, AlertTitle} from "./ui/alert";
import LoadingSpinner from "./LoadingSpinner";
import DOMPurify from 'dompurify';

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
        credentials: 'include', // クレデンシャルを含める
    });
    
    if (!playlistsResponse.ok) {
        throw new Error(`API request failed with status ${playlistsResponse.status}`);
    }
    
    const data = await playlistsResponse.json();
    // データが配列であることを確認し、配列でない場合はitemsプロパティを使用
    return Array.isArray(data) ? data : data.items || [];
};

/**
 * フォロー中のプレイリストを表示するコンポーネント
 * @param {FollowedPlaylistsProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} フォロー中のプレイリストを表示するJSX要素
 */
const FollowedPlaylists: React.FC<FollowedPlaylistsProps> = ({onPlaylistClick}) => {
    // useQueryフックを使用してプレイリストデータを取得
    const {data: playlists, isLoading, error} = useQuery<Playlist[], Error>({
        queryKey: ['followedPlaylists'],
        queryFn: fetchFollowedPlaylists,
    });
    
    if (isLoading) {
        // データがロード中の場合、ローディングスピナーを表示
        return <LoadingSpinner loading={isLoading}/>;
    }
    
    if (error) {
        // エラーが発生した場合、エラーメッセージを表示
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
            </Alert>
        );
    }
    
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">フォロー中のプレイリスト</h2>
            {playlists && playlists.length === 0 ? (
                <p>フォロー中のプレイリストはありません。</p>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {playlists && playlists.map((playlist) => {
                        // プレイリスト名と画像URLをサニタイズ
                        const sanitizedName = DOMPurify.sanitize(playlist.name);
                        const sanitizedImageUrl = playlist.images && playlist.images.length > 0
                            ? DOMPurify.sanitize(playlist.images[0].url)
                            : '';
                        const sanitizedTrackCount = DOMPurify.sanitize(playlist.tracks.total.toString());
                        
                        return (
                            <li key={playlist.id} className="bg-gray-100 p-4 rounded-lg shadow">
                                <div onClick={() => onPlaylistClick(playlist.id)}>
                                    {sanitizedImageUrl ? (
                                        <img
                                            src={sanitizedImageUrl}
                                            alt={sanitizedName}
                                            className="w-full h-40 object-cover mb-2 cursor-pointer"
                                        />
                                    ) : (
                                        <div className="w-full h-40 bg-gray-200 flex items-center justify-center mb-2">
                                            <span className="text-gray-500">No Image</span>
                                        </div>
                                    )}
                                    <h3 className="font-semibold cursor-pointer">
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
