// app/components/RecommendationsTable.test.tsx

import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {RecommendationsTable} from './RecommendationsTable';
import {Track} from '../types/track';
import {axe, toHaveNoViolations} from 'jest-axe';
import * as utils from '../lib/trackUtils';
import {expect} from '@jest/globals';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

// jest-axeのカスタムマッチャーを追加
expect.extend(toHaveNoViolations);

// trackUtilsモジュールをモック化
jest.mock('@/app/lib/trackUtils');
const mockedUtils = utils as jest.Mocked<typeof utils>;

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

describe('RecommendationsTable', () => {
    // 各テストの前にモックをクリアし、console.logをモック化
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {
        });
    });
    
    /**
     * アクセシビリティ違反がないことを確認するテスト
     */
    it('should not have any accessibility violations', async () => {
        const queryClient = new QueryClient();
        const {container} = render(
            <QueryClientProvider client={queryClient}>
                <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="user1" playlistId="playlist1"/>
            </QueryClientProvider>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    /**
     * テーブルが正しいヘッダーを持っていることを確認するテスト
     */
    it('renders the table with correct headers', () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>
            </QueryClientProvider>
        );
        expect(screen.getByText('Album')).toBeInTheDocument();
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Artist')).toBeInTheDocument();
        expect(screen.getByText('Preview')).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();
    });
    
    /**
     * トラックデータが正しく表示されることを確認するテスト
     */
    it('displays track data correctly', () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>
            </QueryClientProvider>
        );
        mockTracks.forEach(track => {
            expect(screen.getByText(track.name)).toBeInTheDocument();
            expect(screen.getByText(track.artists[0].name)).toBeInTheDocument();
        });
    });
    
    /**
     * オーナーのみが追加と削除ボタンを表示することを確認するテスト
     */
    it('shows add and remove buttons only for the owner', () => {
        const queryClient = new QueryClient();
        const {rerender} = render(
            <QueryClientProvider client={queryClient}>
                <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>
            </QueryClientProvider>
        );
        expect(screen.getAllByText('追加')).toHaveLength(mockTracks.length);
        
        rerender(
            <QueryClientProvider client={queryClient}>
                <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="user2" playlistId="playlist1"/>
            </QueryClientProvider>
        );
        expect(screen.queryByText('追加')).not.toBeInTheDocument();});
    
    /**
     * トラック追加ボタンのクリックが正しく処理されることを確認するテスト
     */
    it('handles add track button click correctly', async () => {
        const queryClient = new QueryClient();
        mockedUtils.addTrackToPlaylist.mockResolvedValue(true);
        render(
            <QueryClientProvider client={queryClient}>
                <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>
            </QueryClientProvider>
        );
        const addButtons = screen.getAllByText('追加');
        fireEvent.click(addButtons[0]);
        await waitFor(() => {
            expect(mockedUtils.addTrackToPlaylist).toHaveBeenCalledWith('playlist1', '1');
        });
    });

    /**
     * 複数のアーティストがいるトラックでは最初のアーティストのみ表示することを確認するテスト
     */
    it('displays only the first artist for tracks with multiple artists', () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>
            </QueryClientProvider>
        );
        expect(screen.getByText('Test Artist 3')).toBeInTheDocument();
        expect(screen.queryByText('Test Artist 4')).not.toBeInTheDocument();
    });
    
    /**
     * トラック削除ボタンのクリックが正しく処理されることを確認するテスト
     */
    it('handles remove track button click correctly', async () => {
        const queryClient = new QueryClient();
        mockedUtils.addTrackToPlaylist.mockResolvedValue(true);
        mockedUtils.removeTrackFromPlaylist.mockResolvedValue(true);
        render(
            <QueryClientProvider client={queryClient}>
                <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>
            </QueryClientProvider>
        );
        const addButtons = screen.getAllByText('追加');
        fireEvent.click(addButtons[0]);
        await waitFor(() => {
            expect(screen.getByText('削除')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText('削除'));
        await waitFor(() => {
            expect(mockedUtils.removeTrackFromPlaylist).toHaveBeenCalledWith('playlist1', '1');
        });
    });
    
    /**
     * プレイリスト作成ボタンのクリックが正しく処理されることを確認するテスト
     */
    it('handles create playlist button click correctly', async () => {
        const queryClient = new QueryClient();
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({playlistId: 'newPlaylist1'}),
        });
        render(
            <QueryClientProvider client={queryClient}>
                <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>
            </QueryClientProvider>
        );
        fireEvent.click(screen.getByText('おすすめ楽曲をもとにプレイリストを作成する'));
        await waitFor(() => {
            expect(screen.getByText('作成したプレイリストを表示')).toBeInTheDocument();
        });
    });
    
    /**
     * プレイリスト作成エラーが正しく処理されることを確認するテスト
     */
    it('handles create playlist error correctly', async () => {
        const queryClient = new QueryClient();
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            json: () => Promise.resolve({details: 'Error creating playlist'}),
        });
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });
        render(
            <QueryClientProvider client={queryClient}>
                <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>
            </QueryClientProvider>
        );
        fireEvent.click(screen.getByText('おすすめ楽曲をもとにプレイリストを作成する'));
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith("プレイリストの作成中にエラーが発生しました。", expect.any(Error));
        });
        consoleSpy.mockRestore();
    });
    
    /**
     * ソート機能が正しく動作することを確認するテスト
     */
    it('sorts tracks correctly when clicking on sortable headers', async () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>
            </QueryClientProvider>
        );
        const titleHeader = screen.getByText('Title');
        fireEvent.click(titleHeader);
        await waitFor(() => {
            const titles = screen.getAllByTestId('name').map(el => el.textContent);
            expect(titles).toEqual(['Test Track 1', 'Test Track 2', 'Test Track 3']);
        });
        fireEvent.click(titleHeader);
        await waitFor(() => {
            const titles = screen.getAllByTestId('name').map(el => el.textContent);
            expect(titles).toEqual(['Test Track 3', 'Test Track 2', 'Test Track 1']);
        });
    });
});
