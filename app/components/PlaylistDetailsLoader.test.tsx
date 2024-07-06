// app/components/__tests__/PlaylistDetailsLoader.test.tsx

import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import axios from 'axios';
import PlaylistDetailsLoader from './PlaylistDetailsLoader';
import '@testing-library/jest-dom';
import {axe, toHaveNoViolations} from 'jest-axe';
import {expect} from '@jest/globals';

// axiosのモック
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// PlaylistDetailsコンポーネントのモック
jest.mock('./PlaylistDetails', () => {
    return function DummyPlaylistDetails(props: any) {
        return (
            <div data-testid="playlist-details">
                Playlist Details Mock
                <p>Playlist Name: {props.playlistName}</p>
                <p>Owner ID: {props.ownerId}</p>
                <p>User ID: {props.userId}</p>
                <p>Playlist ID: {props.playlistId}</p>
                <p>Tracks: {props.tracks.length}</p>
                <p>Recommendations: {props.recommendations.length}</p>
            </div>
        );
    };
});

// LoadingSpinnerコンポーネントのモック
jest.mock('./LoadingSpinner', () => {
    return function DummyLoadingSpinner({loading}: { loading: boolean }) {
        return loading ? <div data-testid="loading-spinner">Loading...</div> : null;
    };
});

expect.extend(toHaveNoViolations);

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return ({children}: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('PlaylistDetailsLoader', () => {
    const mockPlaylistId = 'mock-playlist-id';
    const mockUserId = 'mock-user-id';
    
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('renders loading spinner initially', async () => {
        mockedAxios.get.mockImplementationOnce(() => new Promise(() => {
        }));
        
        render(<PlaylistDetailsLoader playlistId={mockPlaylistId} userId={mockUserId}/>, {wrapper: createWrapper()});
        
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
    
    it('renders playlist details after successful data fetch', async () => {
        const mockResponse = {
            data: {
                tracks: {items: [{track: {id: '1', name: 'Track 1'}, audioFeatures: {}}]},
                genreCounts: {pop: 1},
                recommendations: [{id: '2', name: 'Track 2'}],
                playlistName: 'Mock Playlist',
                ownerId: 'mock-owner-id',
            },
        };
        mockedAxios.get.mockResolvedValueOnce(mockResponse);
        
        render(<PlaylistDetailsLoader playlistId={mockPlaylistId} userId={mockUserId}/>, {wrapper: createWrapper()});
        
        await waitFor(() => {
            expect(screen.getByTestId('playlist-details')).toBeInTheDocument();
        });
        
        expect(mockedAxios.get).toHaveBeenCalledWith(`/api/playlists/${mockPlaylistId}`);
        
        expect(screen.getByText('Playlist Name: Mock Playlist')).toBeInTheDocument();
        expect(screen.getByText('Owner ID: mock-owner-id')).toBeInTheDocument();
        expect(screen.getByText('User ID: mock-user-id')).toBeInTheDocument();
        expect(screen.getByText('Playlist ID: mock-playlist-id')).toBeInTheDocument();
        expect(screen.getByText('Tracks: 1')).toBeInTheDocument();
        expect(screen.getByText('Recommendations: 1')).toBeInTheDocument();
    });
    
    it('renders error message when playlist is not found', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Not Found'));
        
        render(<PlaylistDetailsLoader playlistId={mockPlaylistId} userId={mockUserId}/>, {wrapper: createWrapper()});
        
        await waitFor(() => {
            expect(screen.getByText('プレイリスト取得中にエラーが発生しました')).toBeInTheDocument();
        });
        
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    it('handles network errors gracefully', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));
        
        render(<PlaylistDetailsLoader playlistId={mockPlaylistId} userId={mockUserId}/>, {wrapper: createWrapper()});
        
        await waitFor(() => {
            expect(screen.getByText('プレイリスト取得中にエラーが発生しました')).toBeInTheDocument();
        });
    });
    
    it('handles empty playlist data', async () => {
        const mockResponse = {
            data: {
                tracks: {items: []},
                genreCounts: {},
                recommendations: [],
                playlistName: 'Empty Playlist',
                ownerId: 'mock-owner-id',
            },
        };
        mockedAxios.get.mockResolvedValueOnce(mockResponse);
        
        render(<PlaylistDetailsLoader playlistId={mockPlaylistId} userId={mockUserId}/>, {wrapper: createWrapper()});
        
        await waitFor(() => {
            expect(screen.getByTestId('playlist-details')).toBeInTheDocument();
        });
        
        expect(screen.getByText('Tracks: 0')).toBeInTheDocument();
        expect(screen.getByText('Recommendations: 0')).toBeInTheDocument();
    });
    
    it('re-fetches data when playlistId changes', async () => {
        const mockResponse1 = {
            data: {
                tracks: {items: [{track: {id: '1', name: 'Track 1'}, audioFeatures: {}}]},
                genreCounts: {pop: 1},
                recommendations: [{id: '2', name: 'Track 2'}],
                playlistName: 'Playlist 1',
                ownerId: 'owner-1',
            },
        };
        const mockResponse2 = {
            data: {
                tracks: {items: [{track: {id: '3', name: 'Track 3'}, audioFeatures: {}}]},
                genreCounts: {rock: 1},
                recommendations: [{id: '4', name: 'Track 4'}],
                playlistName: 'Playlist 2',
                ownerId: 'owner-2',
            },
        };
        
        mockedAxios.get.mockResolvedValueOnce(mockResponse1);
        
        const {rerender} = render(<PlaylistDetailsLoader playlistId={mockPlaylistId}
                                                         userId={mockUserId}/>, {wrapper: createWrapper()});
        
        await waitFor(() => {
            expect(screen.getByText('Playlist Name: Playlist 1')).toBeInTheDocument();
        });
        
        mockedAxios.get.mockResolvedValueOnce(mockResponse2);
        
        rerender(<PlaylistDetailsLoader playlistId="new-playlist-id" userId={mockUserId}/>);
        
        await waitFor(() => {
            expect(screen.getByText('Playlist Name: Playlist 2')).toBeInTheDocument();
        });
        
        expect(mockedAxios.get).toHaveBeenCalledTimes(2);
        expect(mockedAxios.get).toHaveBeenCalledWith('/api/playlists/new-playlist-id');
    });
    
    it('has no accessibility violations', async () => {
        const mockResponse = {
            data: {
                tracks: {items: [{track: {id: '1', name: 'Track 1'}, audioFeatures: {}}]},
                genreCounts: {pop: 1},
                recommendations: [{id: '2', name: 'Track 2'}],
                playlistName: 'Mock Playlist',
                ownerId: 'mock-owner-id',
            },
        };
        mockedAxios.get.mockResolvedValueOnce(mockResponse);
        
        const {container} = render(<PlaylistDetailsLoader playlistId={mockPlaylistId}
                                                          userId={mockUserId}/>, {wrapper: createWrapper()});
        
        await waitFor(() => {
            expect(screen.getByTestId('playlist-details')).toBeInTheDocument();
        });
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
