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
import {expect} from '@jest/globals'

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
    // ... recommendations data
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

// fetchのモック
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({status: 'success', userId: 'testUserId'}),
    })
) as jest.Mock;

describe('PlaylistDetails', () => {
    it('プレイリストの詳細を表示する', async () => {
        const queryClient = new QueryClient();
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
        
        // 非同期処理が完了するまで待機
        await screen.findByText('My Playlist');
        
        // プレイリスト名が表示されていることを確認
        expect(screen.getByText('My Playlist')).toBeInTheDocument();
        
        // 作成者名が表示されていることを確認
        expect(screen.getByText('User 123')).toBeInTheDocument(); // 正規表現を使用
        
        // 楽曲数が表示されていることを確認
        expect(screen.getByText('楽曲数: 1')).toBeInTheDocument();
        
        // 総再生時間が表示されていることを確認
        expect(screen.getByText('総再生時間: 3:00')).toBeInTheDocument();
        
        // トラックテーブルが表示されていることを確認
        expect(screen.getByText('Track 1')).toBeInTheDocument();
        
        // ジャンル分布チャートが表示されていることを確認
        expect(screen.getByText('ジャンル分布:')).toBeInTheDocument();
        
        // おすすめテーブルが表示されていることを確認
        expect(screen.getByText('おすすめ:')).toBeInTheDocument();
    });
    
    it('お気に入りボタンのクリックを処理する', async () => {
        const queryClient = new QueryClient();
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
        
        // 非同期処理が完了するまで待機
        await screen.findByText('My Playlist');
        
        // お気に入りボタンをクリック
        const starButton = screen.getByText('☆');
        await userEvent.click(starButton);
        
        // addFavorite関数が呼び出されたことを確認
        expect(mockFavoriteContextValue.addFavorite).toHaveBeenCalledWith('playlist123', 'My Playlist', 1);
        
        // お気に入りボタンが星印に変わることを確認
        expect(screen.getByText('★')).toBeInTheDocument();
        
        // 再度お気に入りボタンをクリック
        await userEvent.click(starButton);
        
        // removeFavorite関数が呼び出されたことを確認
        expect(mockFavoriteContextValue.removeFavorite).toHaveBeenCalledWith('playlist123');
        
        // お気に入りボタンが空の星印に戻ることを確認
        expect(screen.getByText('☆')).toBeInTheDocument();
    });
});
