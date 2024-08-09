// PlaylistDetails.test.tsx

"use client";

import {render, screen} from '@testing-library/react';
import PlaylistDetails from './PlaylistDetails';
import {Track} from '../types/track';
import {AudioFeatures} from '../types/audioFeaturesTypes';
import {FavoriteContext} from '../context/FavoriteContext';
import {UserContextProvider} from '../context/UserContext';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import {expect} from '@jest/globals';

// モックデータ
const mockTracks: Track[] = [
    {
        previewUrl: 'https://example.com/preview1.mp3',
        id: 'track1',
        name: 'Track 1',
        artists: [{externalUrls: {}, name: 'Artist 1'}],
        album: {
            externalUrls: {},
            name: 'Album 1',
            images: [{url: 'https://example.com/album1.jpg'}],
        },
        durationMs: 180000,
        audioFeatures: {
            danceability: 0.7,
            energy: 0.8,
            key: 1,
            loudness: -5,
            mode: 'major',
            speechiness: 0.1,
            acousticness: 0.2,
            instrumentalness: 0,
            liveness: 0.3,
            valence: 0.9,
            tempo: 120,
            timeSignature: 4,
        },
    },
];

const mockAverageAudioFeatures: AudioFeatures = {
    acousticness: 0.5,
    danceability: 0.6,
    energy: 0.7,
    instrumentalness: 0.2,
    liveness: 0.4,
    speechiness: 0.3,
    valence: 0.8,
};

const mockGenreCounts = {
    'pop': 5,
    'rock': 3,
    'jazz': 2,
};

const mockRecommendations: Track[] = [
    {
        previewUrl: 'https://example.com/preview2.mp3',
        id: 'track2',
        name: 'Track 2',
        artists: [{externalUrls: {}, name: 'Artist 2'}],
        album: {
            externalUrls: {},
            name: 'Album 2',
            images: [{url: 'https://example.com/album2.jpg'}],
        },
        durationMs: 200000,
        audioFeatures: {
            danceability: 0.6,
            energy: 0.7,
            key: 2,
            loudness: -6,
            mode: 'minor',
            speechiness: 0.2,
            acousticness: 0.3,
            instrumentalness: 0.1,
            liveness: 0.4,
            valence: 0.7,
            tempo: 130,
            timeSignature: 4,
        },
    },
];

// FavoriteContextのモック値
const mockFavoriteContextValue = {
    favorites: {},
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    fetchFavorites: jest.fn(),
};

// ResizeObserverのモック
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

describe('PlaylistDetails', () => {
    const queryClient = new QueryClient();
    
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({status: 'success', userId: 'testUserId'}),
            })
        ) as jest.Mock;
    });
    
    it('プレイリストの詳細を表示する', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider>
                    <FavoriteContext.Provider value={mockFavoriteContextValue}>
                        <PlaylistDetails
                            tracks={mockTracks}
                            genreCounts={mockGenreCounts}
                            recommendations={mockRecommendations}
                            playlistName="My Playlist"
                            ownerId="user123"
                            userId="user123"
                            playlistId="playlist123"
                            totalDuration="3:00"
                            averageAudioFeatures={mockAverageAudioFeatures}
                            totalTracks={mockTracks.length}
                            ownerName="User 123"
                        />
                    </FavoriteContext.Provider>
                </UserContextProvider>
            </QueryClientProvider>
        );
        
        await screen.findByText('My Playlist');
        
        expect(screen.getByText('My Playlist')).toBeInTheDocument();
        expect(screen.getByText('User 123')).toBeInTheDocument();
        expect(screen.getByText('楽曲数: 1')).toBeInTheDocument();
        expect(screen.getByText('総再生時間: 3:00')).toBeInTheDocument();
        expect(screen.getByText('Track 1')).toBeInTheDocument();
        expect(screen.getByText('ジャンル分布:')).toBeInTheDocument();
        expect(screen.getByText('おすすめ:')).toBeInTheDocument();
    });
    
    it('お気に入りボタンのクリックを処理する', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider>
                    <FavoriteContext.Provider value={mockFavoriteContextValue}>
                        <PlaylistDetails
                            tracks={mockTracks}
                            genreCounts={mockGenreCounts}
                            recommendations={mockRecommendations}
                            playlistName="My Playlist"
                            ownerId="user123"
                            userId="user123"
                            playlistId="playlist123"
                            totalDuration="3:00"
                            averageAudioFeatures={mockAverageAudioFeatures}
                            totalTracks={mockTracks.length}
                            ownerName="User 123"
                        />
                    </FavoriteContext.Provider>
                </UserContextProvider>
            </QueryClientProvider>
        );
        
        await screen.findByText('My Playlist');
        
        const starButton = screen.getByText('☆');
        await userEvent.click(starButton);
        
        expect(mockFavoriteContextValue.addFavorite).toHaveBeenCalledWith('playlist123', 'My Playlist', 1);
        expect(screen.getByText('★')).toBeInTheDocument();
        
        await userEvent.click(starButton);
        
        expect(mockFavoriteContextValue.removeFavorite).toHaveBeenCalledWith('playlist123');
        expect(screen.getByText('☆')).toBeInTheDocument();
    });
    
    it('ジャンル分布が空の場合の処理を確認する', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider>
                    <FavoriteContext.Provider value={mockFavoriteContextValue}>
                        <PlaylistDetails
                            tracks={mockTracks}
                            genreCounts={{}}
                            recommendations={mockRecommendations}
                            playlistName="My Playlist"
                            ownerId="user123"
                            userId="user123"
                            playlistId="playlist123"
                            totalDuration="3:00"
                            averageAudioFeatures={mockAverageAudioFeatures}
                            totalTracks={mockTracks.length}
                            ownerName="User 123"
                        />
                    </FavoriteContext.Provider>
                </UserContextProvider>
            </QueryClientProvider>
        );
        
        await screen.findByText('My Playlist');
        
        expect(screen.queryByText('ジャンル分布:')).not.toBeInTheDocument();
    });
    
    it('プレイリスト名がnullの場合の処理を確認する', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider>
                    <FavoriteContext.Provider value={mockFavoriteContextValue}>
                        <PlaylistDetails
                            tracks={mockTracks}
                            genreCounts={mockGenreCounts}
                            recommendations={mockRecommendations}
                            playlistName={null}
                            ownerId="user123"
                            userId="user123"
                            playlistId="playlist123"
                            totalDuration="3:00"
                            averageAudioFeatures={mockAverageAudioFeatures}
                            totalTracks={mockTracks.length}
                            ownerName="User 123"
                        />
                    </FavoriteContext.Provider>
                </UserContextProvider>
            </QueryClientProvider>
        );
        
        expect(screen.queryByText('My Playlist')).not.toBeInTheDocument();
    });
    
    it('お気に入り登録/解除の失敗を処理する', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
            })
        ) as jest.Mock;
        
        console.error = jest.fn();
        
        render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider>
                    <FavoriteContext.Provider value={mockFavoriteContextValue}>
                        <PlaylistDetails
                            tracks={mockTracks}
                            genreCounts={mockGenreCounts}
                            recommendations={mockRecommendations}
                            playlistName="My Playlist"
                            ownerId="user123"
                            userId="user123"
                            playlistId="playlist123"
                            totalDuration="3:00"
                            averageAudioFeatures={mockAverageAudioFeatures}
                            totalTracks={mockTracks.length}
                            ownerName="User 123"
                        />
                    </FavoriteContext.Provider>
                </UserContextProvider>
            </QueryClientProvider>
        );
        
        await screen.findByText('My Playlist');
        
        const starButton = screen.getByText('☆');
        await userEvent.click(starButton);
        
        expect(console.error).toHaveBeenCalledWith('お気に入り登録/解除に失敗しました。');
    });
    
    it('お気に入り登録/解除中にエラーが発生した場合の処理を確認する', async () => {
        global.fetch = jest.fn(() => Promise.reject(new Error('Network error'))) as jest.Mock;
        
        console.error = jest.fn();
        
        render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider>
                    <FavoriteContext.Provider value={mockFavoriteContextValue}>
                        <PlaylistDetails
                            tracks={mockTracks}
                            genreCounts={mockGenreCounts}
                            recommendations={mockRecommendations}
                            playlistName="My Playlist"
                            ownerId="user123"
                            userId="user123"
                            playlistId="playlist123"
                            totalDuration="3:00"
                            averageAudioFeatures={mockAverageAudioFeatures}
                            totalTracks={mockTracks.length}
                            ownerName="User 123"
                        />
                    </FavoriteContext.Provider>
                </UserContextProvider>
            </QueryClientProvider>
        );
        
        await screen.findByText('My Playlist');
        
        const starButton = screen.getByText('☆');
        await userEvent.click(starButton);
        
        expect(console.error).toHaveBeenCalledWith('お気に入り登録/解除中にエラーが発生しました。', expect.any(Error));
    });
});
