// app/components/RecommendationsTable.test.tsx

import {TooltipProvider} from '@/app/components/ui/tooltip'
import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {RecommendationsTable} from '@/app/components/RecommendationsTable';
import {Track} from '@/app/types/track';
import {axe, toHaveNoViolations} from 'jest-axe';
import * as utils from '@/app/lib/trackUtils';
import {expect} from '@jest/globals';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

// jest-axeのカスタムマッチャーを追加
expect.extend(toHaveNoViolations);

// trackUtilsモジュールをモック化
jest.mock('@/app/lib/trackUtils');
const mockedUtils = utils as jest.Mocked<typeof utils>;

// JSDOMでwindow.openをモック化
beforeAll(() => {
    window.open = jest.fn();
});

// モックデータ
const mockTracks: Track[] = [
    {
        album: {
            externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/track/1'}},
            images: [
                {url: 'https://i.scdn.co/image/ab67616d0000b2731234567890abcdef123456'},
                {url: 'https://i.scdn.co/image/ab67616d00001e021234567890abcdef123456'},
                {url: 'https://i.scdn.co/image/ab67616d000048511234567890abcdef123456'},
            ],
            name: 'Album 1',
        },
        artists: [
            {
                externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/album/1'}},
                name: 'Artist 1',
            },
        ],
        durationMs: 240000,
        externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/track/1'}},
        id: '1',
        name: 'Test Track 1',
        previewUrl: 'https://p.scdn.co/mp3-preview/1234567890abcdef1234567890abcdef123456',
        audioFeatures: null
    },
    {
        album: {
            externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/album/2'}},
            images: [
                {url: 'https://i.scdn.co/image/ab67616d0000b2730987654321fedcba0987654'},
                {url: 'https://i.scdn.co/image/ab67616d00001e020987654321fedcba0987654'},
                {url: 'https://i.scdn.co/image/ab67616d000048510987654321fedcba0987654'},
            ],
            name: 'Album 2',
        },
        artists: [
            {
                externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/artist/2'}},
                name: 'Artist 2',
            },
        ],
        durationMs: 180000,
        externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/track/2'}},
        id: '2',
        name: 'Test Track 2',
        previewUrl: null,
        audioFeatures: null
    },
    {
        album: {
            externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/track/3'}},
            images: [
                {url: 'https://i.scdn.co/image/ab67616d0000b2731234567890abcdef123456'},
                {url: 'https://i.scdn.co/image/ab67616d00001e021234567890abcdef123456'},
                {url: 'https://i.scdn.co/image/ab67616d000048511234567890abcdef123456'},
            ],
            name: 'Test Album 3',
        },
        artists: [
            {
                externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/album/3'}},
                name: 'Artist 4',
            },
            {
                externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/album/3'}},
                name: 'Artist 5',
            },
        ],
        durationMs: 240000,
        externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/track/3'}},
        id: '3',
        name: 'Test Track 3',
        previewUrl: 'https://p.scdn.co/mp3-preview/1234567890abcdef1234567890abcdef123456',
        audioFeatures: null
    },
];

describe('RecommendationsTable', () => {
    /**
     * アクセシビリティ違反がないことを確認するテスト
     */
    it('should not have any accessibility violations', async () => {
        const queryClient = new QueryClient();
        const {container} = render(
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="user1" playlistId="playlist1"/>
                </TooltipProvider>
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
                <TooltipProvider>
                    <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>
                </TooltipProvider>
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
                <TooltipProvider>
                    <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>
                </TooltipProvider>
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
                <TooltipProvider>
                    <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>
                </TooltipProvider>
            </QueryClientProvider>
        );
        expect(screen.getAllByText('追加')).toHaveLength(mockTracks.length);
        
        rerender(
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="user2" playlistId="playlist1"/>
                </TooltipProvider>
            </QueryClientProvider>
        );
        expect(screen.queryByText('追加')).not.toBeInTheDocument();
    });
    
    /**
     * トラック追加ボタンのクリックが正しく処理されることを確認するテスト
     */
    it('handles add track button click correctly', async () => {
        const queryClient = new QueryClient();
        mockedUtils.addTrackToPlaylist.mockResolvedValue(true);
        render(
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>
                </TooltipProvider>
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
                <TooltipProvider>
                    <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>
                </TooltipProvider>
            </QueryClientProvider>
        );
        // Artist 4が表示されていることを確認
        expect(screen.getByText('Artist 4')).toBeInTheDocument();
        expect(screen.queryByText('Artist 5')).not.toBeInTheDocument(); // 2番目のアーティストは表示されない
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
                <TooltipProvider>
                    <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>
                </TooltipProvider>
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
                <TooltipProvider>
                    <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>
                </TooltipProvider>
            </QueryClientProvider>
        );
    });
    
    /**
     * ソート機能が正しく動作することを確認するテスト
     */
    it('sorts tracks correctly when clicking on sortable headers', async () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>
                </TooltipProvider>
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
