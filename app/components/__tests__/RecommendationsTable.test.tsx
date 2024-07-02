// app/components/__tests__/RecommendationsTable.test.tsx

import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {RecommendationsTable} from '../RecommendationsTable';
import '@testing-library/jest-dom';
import {Track} from '@/app/types/track';

// モックデータ
const mockTracks: Track[] = [
    {
        id: '1',
        name: 'Test Track 1',
        album: {
            name: 'Test Album 1', images: [{url: 'https://example.com/image1.jpg'}],
            externalUrls: undefined
        },
        artists: [{
            name: 'Test Artist 1',
            externalUrls: undefined
        }],
        previewUrl: 'https://example.com/preview1.mp3',
        durationMs: 180000, // 3分 = 180,000ミリ秒
    },
    {
        id: '2',
        name: 'Test Track 2',
        album: {
            name: 'Test Album 2', images: [{url: 'https://example.com/image2.jpg'}],
            externalUrls: undefined
        },
        artists: [{
            name: 'Test Artist 2',
            externalUrls: undefined
        }],
        previewUrl: undefined,
        durationMs: 240000, // 4分 = 240,000ミリ秒
    },
];

// フェッチのモック
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
    })
) as jest.Mock;

describe('RecommendationsTable', () => {
    // 各テストの前にフェッチのモックをリセット
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
    });
    
    // テーブルが正しくレンダリングされることをテスト
    it('renders the table with correct headers', () => {
        render(<RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="user1" playlistId="playlist1"/>);
        
        expect(screen.getByText('Album')).toBeInTheDocument();
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Artist')).toBeInTheDocument();
        expect(screen.getByText('Preview')).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();
    });
    
    // トラックデータが正しく表示されることをテスト
    it('displays track data correctly', () => {
        render(<RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="user1" playlistId="playlist1"/>);
        
        expect(screen.getByText('Test Track 1')).toBeInTheDocument();
        expect(screen.getByText('Test Artist 1')).toBeInTheDocument();
        expect(screen.getByText('Test Track 2')).toBeInTheDocument();
        expect(screen.getByText('Test Artist 2')).toBeInTheDocument();
    });
    
    // プレビューボタンが正しく表示されることをテスト
    it('shows preview button only for tracks with previewUrl', () => {
        render(<RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="user1" playlistId="playlist1"/>);
        
        const previewButtons = screen.getAllByText('試聴する');
        expect(previewButtons).toHaveLength(1);
    });
    
    // オーナーの場合のみ追加・削除ボタンが表示されることをテスト
    it('shows add and remove buttons only for the owner', () => {
        const {rerender} = render(<RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1"
                                                        playlistId="playlist1"/>);
        
        expect(screen.getAllByText('追加')).toHaveLength(2);
        expect(screen.getAllByText('削除')).toHaveLength(2);
        
        rerender(<RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="user2" playlistId="playlist1"/>);
        
        expect(screen.queryByText('追加')).not.toBeInTheDocument();
        expect(screen.queryByText('削除')).not.toBeInTheDocument();
    });
    
    // 試聴ボタンのクリックをテスト
    it('handles play button click correctly', () => {
        render(<RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="user1" playlistId="playlist1"/>);
        
        const playButton = screen.getByText('試聴する');
        fireEvent.click(playButton);
        expect(playButton).toHaveTextContent('停止');
        
        fireEvent.click(playButton);
        expect(playButton).toHaveTextContent('試聴する');
    });
    
    // 追加ボタンのクリックをテスト
    it('handles add track button click correctly', async () => {
        render(<RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>);
        
        const addButton = screen.getAllByText('追加')[0];
        fireEvent.click(addButton);
        
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/playlists/playlist1/tracks', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({trackId: '1'}),
            });
        });
    });
    
    // 削除ボタンのクリックをテスト
    it('handles remove track button click correctly', async () => {
        render(<RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>);
        
        const removeButton = screen.getAllByText('削除')[0];
        fireEvent.click(removeButton);
        
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/playlists/playlist1/tracks', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({trackId: '1'}),
            });
        });
    });
});
