// app/components/FavoritePlaylistsTable.tsx
"use client";

import {useState, useEffect} from 'react';
import {useQuery} from '@tanstack/react-query';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table';
import {format} from 'date-fns';
import {usePlaylist} from '@/app/context/PlaylistContext';

interface FavoritePlaylist {
    playlistId: string;
    playlistName: string;
    playlistOwnerName: string;
    totalTracks: number;
    addedAt: string;
}

const fetchFavoritePlaylists = async (): Promise<FavoritePlaylist[]> => {
    const response = await fetch('/api/playlists/favorite', {
        credentials: 'include',
    });
    
    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }
    
    return response.json();
};

const FavoritePlaylistsTable: React.FC = () => {
    const {setSelectedPlaylistId} = usePlaylist(); // usePlaylist を追加
    const {data: playlists, isLoading, error} = useQuery<FavoritePlaylist[], Error>({
        queryKey: ['favoritePlaylists'],
        queryFn: fetchFavoritePlaylists,
    });
    
    if (isLoading) {
        return <div>Loading...</div>;
    }
    
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    
    return (
        <>
            <h2 className="text-2xl font-bold mb-4">お気に入り</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>プレイリスト名</TableHead>
                        <TableHead>作成者</TableHead>
                        <TableHead>楽曲数</TableHead>
                        <TableHead>お気に入り追加日時</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {playlists?.map((playlist) => (
                        <TableRow key={playlist.playlistId}
                                  onClick={() => setSelectedPlaylistId(playlist.playlistId)} // onClick を追加
                                  style={{cursor: "pointer"}}>
                            <TableCell>{playlist.playlistName}</TableCell>
                            <TableCell>{playlist.playlistOwnerName}</TableCell>
                            <TableCell>{playlist.totalTracks}</TableCell>
                            <TableCell>{format(new Date(playlist.addedAt), 'yyyy/MM/dd HH:mm')}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};

export default FavoritePlaylistsTable;
