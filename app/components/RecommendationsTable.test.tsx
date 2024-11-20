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

// モックデータ
const mockTracks: Track[] = [
    {
        album: {
            albumGroup: null,
            albumType: 'album',
            artists: [
                {
                    externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/artist/1'}},
                    href: 'https://api.spotify.com/v1/artists/1',
                    id: '1',
                    name: 'Artist 1',
                    type: 'artist',
                    uri: 'spotify:artist:1',
                },
            ],
            availableMarkets: ['JP', 'US'],
            externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/track/1'}},
            href: 'https://api.spotify.com/v1/albums/1',
            id: '1',
            images: [
                {height: 640, url: 'https://i.scdn.co/image/ab67616d0000b2731234567890abcdef123456', width: 640},
                {height: 300, url: 'https://i.scdn.co/image/ab67616d00001e021234567890abcdef123456', width: 300},
                {height: 64, url: 'https://i.scdn.co/image/ab67616d000048511234567890abcdef123456', width: 64},
            ],
            name: 'Album 1',
            releaseDate: '2023-10-27',
            releaseDatePrecision: 'day',
            restrictions: null,
            type: 'album',
            uri: 'spotify:album:1',
        },
        artists: [
            {
                externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/album/1'}},
                href: 'https://api.spotify.com/v1/artists/1',
                id: '1',
                name: 'Artist 1',
                type: 'artist',
                uri: 'spotify:artist:1',
            },
        ],
        availableMarkets: ['JP', 'US'],
        discNumber: 1,
        durationMs: 240000,
        externalIds: {isrc: 'US1234567890'},
        externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/track/1'}},
        href: 'https://api.spotify.com/v1/tracks/1',
        id: '1',
        isExplicit: false,
        isPlayable: true,
        linkedFrom: null,
        name: 'Test Track 1',
        popularity: 70,
        previewUrl: 'https://p.scdn.co/mp3-preview/1234567890abcdef1234567890abcdef123456',
        restrictions: null,
        trackNumber: 1,
        type: 'track',
        uri: 'spotify:track:1',
    },
    {
        album: {
            albumGroup: null,
            albumType: 'single',
            artists: [
                {
                    externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/artist/2'}},
                    href: 'https://api.spotify.com/v1/artists/2',
                    id: '2',
                    name: 'Artist 2',
                    type: 'artist',
                    uri: 'spotify:artist:2',
                },
            ],
            availableMarkets: ['JP', 'US', 'CA'],
            externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/album/2'}},
            href: 'https://api.spotify.com/v1/albums/2',
            id: '2',
            images: [
                {height: 640, url: 'https://i.scdn.co/image/ab67616d0000b2730987654321fedcba0987654', width: 640},
                {height: 300, url: 'https://i.scdn.co/image/ab67616d00001e020987654321fedcba0987654', width: 300},
                {height: 64, url: 'https://i.scdn.co/image/ab67616d000048510987654321fedcba0987654', width: 64},
            ],
            name: 'Album 2',
            releaseDate: '2024-01-15',
            releaseDatePrecision: 'day',
            restrictions: null,
            type: 'album',
            uri: 'spotify:album:2',
        },
        artists: [
            {
                externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/artist/2'}},
                href: 'https://api.spotify.com/v1/artists/2',
                id: '2',
                name: 'Artist 2',
                type: 'artist',
                uri: 'spotify:artist:2',
            },
        ],
        availableMarkets: ['JP', 'US', 'CA'],
        discNumber: 1,
        durationMs: 180000,
        externalIds: {isrc: 'US0987654321'},
        externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/track/2'}},
        href: 'https://api.spotify.com/v1/tracks/2',
        id: '2',
        isExplicit: true,
        isPlayable: null,
        linkedFrom: null,
        name: 'Test Track 2',
        popularity: 85,
        previewUrl: null,
        restrictions: null,
        trackNumber: 1,
        type: 'track',
        uri: 'spotify:track:2',
    },
    {
        album: {
            albumGroup: null,
            albumType: 'album',
            artists: [
                {
                    externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/album/3'}},
                    href: 'https://api.spotify.com/v1/artists/3',
                    id: '1',
                    name: 'Artist 3',
                    type: 'artist',
                    uri: 'spotify:artist:3',
                },
            ],
            availableMarkets: ['JP', 'US'],
            externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/track/3'}},
            href: 'https://api.spotify.com/v1/albums/3',
            id: '3',
            images: [
                {height: 640, url: 'https://i.scdn.co/image/ab67616d0000b2731234567890abcdef123456', width: 640},
                {height: 300, url: 'https://i.scdn.co/image/ab67616d00001e021234567890abcdef123456', width: 300},
                {height: 64, url: 'https://i.scdn.co/image/ab67616d000048511234567890abcdef123456', width: 64},
            ],
            name: 'Test Album 3',
            releaseDate: '2023-10-27',
            releaseDatePrecision: 'day',
            restrictions: null,
            type: 'album',
            uri: 'spotify:album:3',
        },
        artists: [
            {
                externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/album/3'}},
                href: 'https://api.spotify.com/v1/artists/4',
                id: '1',
                name: 'Artist 4',
                type: 'artist',
                uri: 'spotify:artist:4',
            },
            {
                externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/album/3'}},
                href: 'https://api.spotify.com/v1/artists/5',
                id: '1',
                name: 'Artist 5',
                type: 'artist',
                uri: 'spotify:artist:5',
            },
        ],
        availableMarkets: ['JP', 'US'],
        discNumber: 1,
        durationMs: 240000,
        externalIds: {isrc: 'US1234567890'},
        externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/track/3'}},
        href: 'https://api.spotify.com/v1/tracks/3',
        id: '3',
        isExplicit: false,
        isPlayable: true,
        linkedFrom: null,
        name: 'Test Track 3',
        popularity: 70,
        previewUrl: 'https://p.scdn.co/mp3-preview/1234567890abcdef1234567890abcdef123456',
        restrictions: null,
        trackNumber: 1,
        type: 'track',
        uri: 'spotify:track:3',
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
        fireEvent.click(screen.getByText('おすすめ楽曲をもとにプレイリストを作成する'));
        await waitFor(() => {
            expect(screen.getByText('作成したプレイリストを表示')).toBeInTheDocument();
        });
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
    
    /**
     * 作成されたプレイリストを表示するボタンのクリックが正しく処理されることを確認するテスト
     */
    it('handles view created playlist button click correctly', async () => {
        const queryClient = new QueryClient();
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({playlistId: 'newPlaylist1'}),
        });
        window.open = jest.fn();
        render(
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>
                </TooltipProvider>
            </QueryClientProvider>
        );
        fireEvent.click(screen.getByText('おすすめ楽曲をもとにプレイリストを作成する'));
        await waitFor(() => {
            expect(screen.getByText('作成したプレイリストを表示')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText('作成したプレイリストを表示'));
        expect(window.open).toHaveBeenCalledWith('https://open.spotify.com/playlist/newPlaylist1', '_blank');
    });
});
