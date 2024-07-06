// app/components/FollowedPlaylists.test.tsx
import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import FollowedPlaylists from './FollowedPlaylists';
import {Playlist} from '../types/playlist';
import {axe, toHaveNoViolations} from 'jest-axe';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

// モックデータ
const mockPlaylists: Playlist[] = [
    {
        id: '1',
        name: 'Playlist 1',
        images: [{url: 'https://example.com/image1.jpg'}],
        tracks: {total: 10},
        description: 'This is playlist 1'
    },
    {
        id: '2',
        name: 'Playlist 2',
        images: [{url: 'https://example.com/image2.jpg'}],
        tracks: {total: 20},
        description: 'This is playlist 2'
    },
    {
        id: '3',
        name: 'Playlist 3',
        images: [],
        tracks: {total: 0},
        description: ''
    },
];

// fetchのモック
const mockFetch = jest.fn();
global.fetch = mockFetch;

// onPlaylistClickのモック関数
const mockOnPlaylistClick = jest.fn();

// テスト用のQueryClientを作成
const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

// テスト用のラッパーコンポーネント
const renderWithClient = (ui: React.ReactElement) => {
    const testQueryClient = createTestQueryClient();
    const {rerender, ...result} = render(
        <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
    );
    return {
        ...result,
        rerender: (rerenderUi: React.ReactElement) =>
            rerender(<QueryClientProvider client={testQueryClient}>{rerenderUi}</QueryClientProvider>),
    };
};

describe('FollowedPlaylists', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockPlaylists),
        } as Response);
    });
    
    it('renders loading spinner initially', async () => {
        mockFetch.mockImplementationOnce(() =>
            new Promise(resolve => setTimeout(() => resolve({
                ok: true,
                json: () => Promise.resolve(mockPlaylists),
            }), 100))
        );
        
        renderWithClient(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        
        const spinner = await screen.findByRole('progressbar');
        expect(spinner).toBeInTheDocument();
        
        await waitFor(() => {
            expect(screen.getByText('フォロー中のプレイリスト')).toBeInTheDocument();
        });
    });
    
    it('fetches and displays playlists correctly', async () => {
        renderWithClient(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        
        await waitFor(() => {
            expect(screen.getByText('フォロー中のプレイリスト')).toBeInTheDocument();
        });
        
        mockPlaylists.forEach((playlist) => {
            const playlistElement = screen.getByText(playlist.name);
            expect(playlistElement).toBeInTheDocument();
            
            const trackCount = screen.getByText(`トラック数: ${playlist.tracks.total}`);
            expect(trackCount).toBeInTheDocument();
            
            if (playlist.images && playlist.images.length > 0) {
                const image = screen.getByAltText(playlist.name);
                expect(image).toHaveAttribute('src', playlist.images[0].url);
            } else {
                expect(screen.getByText('No Image')).toBeInTheDocument();
            }
        });
    });
    
    it('calls onPlaylistClick when a playlist is clicked', async () => {
        renderWithClient(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        
        await waitFor(() => {
            expect(screen.getByText('Playlist 1')).toBeInTheDocument();
        });
        
        for (const playlist of mockPlaylists) {
            const playlistElement = screen.getByText(playlist.name);
            await userEvent.click(playlistElement);
            
            expect(mockOnPlaylistClick).toHaveBeenCalledWith(playlist.id);
            
            mockOnPlaylistClick.mockClear();
        }
    });
    
    it('displays correct number of playlists', async () => {
        renderWithClient(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        
        await waitFor(() => {
            const playlists = screen.getAllByRole('listitem');
            expect(playlists).toHaveLength(mockPlaylists.length);
        });
    });
    
    it('displays an error message when fetch fails', async () => {
        const errorMessage = 'API request failed with status 500';
        mockFetch.mockRejectedValueOnce(new Error(errorMessage));
        
        renderWithClient(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        
        await waitFor(() => {
            expect(screen.getByText('Error')).toBeInTheDocument();
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });
    
    it('handles empty playlist response', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([]),
        } as Response);
        
        renderWithClient(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        
        await waitFor(() => {
            expect(screen.getByText('フォロー中のプレイリスト')).toBeInTheDocument();
        });
        
        expect(screen.getByText('フォロー中のプレイリストはありません。')).toBeInTheDocument();
    });
    
    it('has no accessibility violations', async () => {
        const {container} = renderWithClient(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        
        await waitFor(() => {
            expect(screen.getByText('フォロー中のプレイリスト')).toBeInTheDocument();
        });
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    it('matches snapshot', async () => {
        const {asFragment} = renderWithClient(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        
        await waitFor(() => {
            expect(screen.getByText('フォロー中のプレイリスト')).toBeInTheDocument();
        });
        
        expect(asFragment()).toMatchSnapshot();
    });
});
