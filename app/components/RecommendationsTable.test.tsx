// app/components/RecommendationsTable.test.tsx

import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {RecommendationsTable} from './RecommendationsTable';
import '@testing-library/jest-dom';
import {Track} from '@/app/types/track';
import {axe, toHaveNoViolations} from 'jest-axe';
import axios from 'axios';
import {expect} from '@jest/globals';

// jest-axeのマッチャーを追加
expect.extend(toHaveNoViolations);

// モックデータ
const mockTracks: Track[] = [
    {
        id: '1',
        name: 'Test Track 1',
        album: {
            name: 'Test Album 1',
            images: [{url: 'https://example.com/image1.jpg'}],
            externalUrls: {spotify: 'https://open.spotify.com/album/1'}
        },
        artists: [{
            name: 'Test Artist 1',
            externalUrls: {spotify: 'https://open.spotify.com/artist/1'}
        }],
        previewUrl: 'https://example.com/preview1.mp3',
        durationMs: 180000,
    },
    {
        id: '2',
        name: 'Test Track 2',
        album: {
            name: 'Test Album 2',
            images: [{url: 'https://example.com/image2.jpg'}],
            externalUrls: {spotify: 'https://open.spotify.com/album/2'}
        },
        artists: [{
            name: 'Test Artist 2',
            externalUrls: {spotify: 'https://open.spotify.com/artist/2'}
        }],
        previewUrl: undefined,
        durationMs: 240000,
    },
    {
        id: '3',
        name: 'Test Track 3',
        album: {
            name: 'Test Album 3',
            images: [{url: 'https://example.com/image3.jpg'}],
            externalUrls: {spotify: 'https://open.spotify.com/album/3'}
        },
        artists: [
            {name: 'Test Artist 3', externalUrls: {spotify: 'https://open.spotify.com/artist/3'}},
            {name: 'Test Artist 4', externalUrls: {spotify: 'https://open.spotify.com/artist/4'}}
        ],
        previewUrl: 'https://example.com/preview3.mp3',
        durationMs: 300000,
    },
];

// フェッチのモック
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
    })
) as jest.Mock;

// axiosのモック
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Audioのモック
class AudioMock {
    src: string = '';
    play = jest.fn();
    pause = jest.fn();
}

(global as any).Audio = AudioMock;

describe('RecommendationsTable', () => {
    // 各テストの前にモックをリセット
    beforeEach(() => {
        mockedAxios.post.mockClear();
        mockedAxios.delete.mockClear();
    });
    
    // アクセシビリティテスト
    it('should not have any accessibility violations', async () => {
        const {container} = render(<RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="user1"
                                                         playlistId="playlist1"/>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    // テーブルのレンダリングテスト
    it('renders the table with correct headers', () => {
        render(<RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="user1" playlistId="playlist1"/>);
        
        expect(screen.getByText('Album')).toBeInTheDocument();
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Artist')).toBeInTheDocument();
        expect(screen.getByText('Preview')).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();
    });
    
    // トラックデータの表示テスト
    it('displays track data correctly', () => {
        render(<RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="user1" playlistId="playlist1"/>);
        
        mockTracks.forEach(track => {
            expect(screen.getByText(track.name)).toBeInTheDocument();
            expect(screen.getByText(track.artists[0].name)).toBeInTheDocument();
        });
    });
    
    // プレビューボタンの表示テスト
    it('shows preview button only for tracks with previewUrl', () => {
        render(<RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="user1" playlistId="playlist1"/>);
        
        const previewButtons = screen.getAllByText('試聴する');
        expect(previewButtons).toHaveLength(2); // Track 1 と Track 3 のみ
    });
    
    // オーナーの場合の追加・削除ボタン表示テスト
    it('shows add and remove buttons only for the owner', () => {
        const {rerender} = render(<RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1"
                                                        playlistId="playlist1"/>);
        
        expect(screen.getAllByText('追加')).toHaveLength(mockTracks.length);
        expect(screen.getAllByText('削除')).toHaveLength(mockTracks.length);
        
        rerender(<RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="user2" playlistId="playlist1"/>);
        
        expect(screen.queryByText('追加')).not.toBeInTheDocument();
        expect(screen.queryByText('削除')).not.toBeInTheDocument();
    });
    
    // 試聴ボタンのクリックテスト
    it('handles play button click correctly', () => {
        render(<RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="user1" playlistId="playlist1"/>);
        
        const playButtons = screen.getAllByText('試聴する');
        fireEvent.click(playButtons[0]);
        expect(playButtons[0]).toHaveTextContent('停止');
        
        fireEvent.click(playButtons[0]);
        expect(playButtons[0]).toHaveTextContent('試聴する');
    });
    
    // 追加ボタンのクリックテスト
    it('handles add track button click correctly', async () => {
        mockedAxios.post.mockResolvedValue({status: 200});
        
        render(<RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>);
        
        const addButtons = screen.getAllByText('追加');
        fireEvent.click(addButtons[0]);
        
        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith('/api/playlist/add-track', {
                playlistId: 'playlist1',
                trackId: '1',
            });
        });
    });
    
    // 削除ボタンのクリックテスト
    it('handles remove track button click correctly', async () => {
        render(<RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>);
        
        const removeButtons = screen.getAllByText('削除');
        fireEvent.click(removeButtons[0]);
        
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/playlists/playlist1/tracks', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({trackId: '1'}),
            });
        });
    });
    
    // 複数アーティストの表示テスト
    it('displays only the first artist for tracks with multiple artists', () => {
        render(<RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="user1" playlistId="playlist1"/>);
        
        // Track 3 は複数のアーティストを持っていますが、最初のアーティストのみが表示されるはずです
        expect(screen.getByText('Test Artist 3')).toBeInTheDocument();
        expect(screen.queryByText('Test Artist 4')).not.toBeInTheDocument();
    });
    
    // エラーハンドリングのテスト
    it('handles API errors correctly', async () => {
        mockedAxios.post.mockRejectedValue(new Error('API Error'));
        
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });
        
        render(<RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>);
        
        const addButton = screen.getAllByText('追加')[0];
        fireEvent.click(addButton);
        
        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith('エラーが発生しました:', expect.any(Error));
        });
        
        consoleErrorSpy.mockRestore();
    });
});
