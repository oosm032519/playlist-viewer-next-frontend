import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {RecommendationsTable} from './RecommendationsTable';
import {Track} from '../types/track';
import {axe, toHaveNoViolations} from 'jest-axe';
import * as utils from '../lib/trackUtils';
import {expect} from '@jest/globals';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

expect.extend(toHaveNoViolations);

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
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {
        }); // console.logをモック
    });
    
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
    
    it('shows add and remove buttons only for the owner', () => {
        const queryClient = new QueryClient();
        const {rerender} = render(
            <QueryClientProvider client={queryClient}>
                <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>
            </QueryClientProvider>
        );
        expect(screen.getAllByText('追加')).toHaveLength(mockTracks.length);
        expect(screen.getAllByText('削除')).toHaveLength(mockTracks.length);
        
        rerender(
            <QueryClientProvider client={queryClient}>
                <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="user2" playlistId="playlist1"/>
            </QueryClientProvider>
        );
        expect(screen.queryByText('追加')).not.toBeInTheDocument();
        expect(screen.queryByText('削除')).not.toBeInTheDocument();
    });
    
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
    
    it('handles remove track button click correctly', async () => {
        const queryClient = new QueryClient();
        mockedUtils.removeTrackFromPlaylist.mockResolvedValue(true);
        render(
            <QueryClientProvider client={queryClient}>
                <RecommendationsTable tracks={mockTracks} ownerId="owner1" userId="owner1" playlistId="playlist1"/>
            </QueryClientProvider>
        );
        const removeButtons = screen.getAllByText('削除');
        fireEvent.click(removeButtons[0]);
        await waitFor(() => {
            expect(mockedUtils.removeTrackFromPlaylist).toHaveBeenCalledWith('playlist1', '1');
        });
    });
    
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
});
