// app/components/PlaylistDetailsLoader.test.tsx

import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {axe, toHaveNoViolations} from 'jest-axe';
import PlaylistDetailsLoader from './PlaylistDetailsLoader';
import {expect} from '@jest/globals';

// jest-axeのマッチャーを追加
expect.extend(toHaveNoViolations);

// モックコンポーネント
jest.mock('./PlaylistDetails', () => {
    return function MockPlaylistDetails() {
        return <div data-testid="playlist-details">Playlist Details</div>;
    };
});

jest.mock('./LoadingSpinner', () => {
    return function MockLoadingSpinner({loading}: { loading: boolean }) {
        return loading ? <div data-testid="loading-spinner">Loading...</div> : null;
    };
});

// フェッチのモック
global.fetch = jest.fn();

describe('PlaylistDetailsLoader', () => {
    let queryClient: QueryClient;
    
    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
        (global.fetch as jest.Mock).mockClear();
    });
    
    it('renders loading spinner when fetching data', async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            new Promise(() => {
            })
        );
        
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistDetailsLoader playlistId="123"/>
            </QueryClientProvider>
        );
        
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
    
    it('renders playlist details when data is fetched successfully', async () => {
        const mockData = {
            tracks: {items: []},
            genreCounts: {},
            recommendations: [],
            playlistName: 'Test Playlist',
            ownerId: 'owner123',
        };
        
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData),
            })
        );
        
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistDetailsLoader playlistId="123"/>
            </QueryClientProvider>
        );
        
        await waitFor(() => {
            expect(screen.getByTestId('playlist-details')).toBeInTheDocument();
        });
    });
    
    it('renders error message when fetch fails', async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
            })
        );
        
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistDetailsLoader playlistId="123"/>
            </QueryClientProvider>
        );
        
        await waitFor(() => {
            expect(screen.getByText('プレイリスト取得中にエラーが発生しました')).toBeInTheDocument();
        });
    });
    
    it('has no accessibility violations', async () => {
        const mockData = {
            tracks: {items: []},
            genreCounts: {},
            recommendations: [],
            playlistName: 'Test Playlist',
            ownerId: 'owner123',
        };
        
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData),
            })
        );
        
        const {container} = render(
            <QueryClientProvider client={queryClient}>
                <PlaylistDetailsLoader playlistId="123"/>
            </QueryClientProvider>
        );
        
        await waitFor(() => {
            expect(screen.getByTestId('playlist-details')).toBeInTheDocument();
        });
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
