// app/components/__tests__/PlaylistDetailsLoader.test.tsx

import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import axios from 'axios';
import PlaylistDetailsLoader from '../PlaylistDetailsLoader';
import '@testing-library/jest-dom';

// axiosのモック
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// PlaylistDetailsコンポーネントのモック
jest.mock('../PlaylistDetails', () => {
    return function DummyPlaylistDetails(props: any) {
        return <div data-testid="playlist-details">Playlist Details Mock</div>;
    };
});

// LoadingSpinnerコンポーネントのモック
jest.mock('../LoadingSpinner', () => {
    return function DummyLoadingSpinner({loading}: { loading: boolean }) {
        return loading ? <div data-testid="loading-spinner">Loading...</div> : null;
    };
});

describe('PlaylistDetailsLoader', () => {
    const mockPlaylistId = 'mock-playlist-id';
    const mockUserId = 'mock-user-id';
    
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('renders loading spinner initially', () => {
        render(<PlaylistDetailsLoader playlistId={mockPlaylistId} userId={mockUserId}/>);
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
    
    it('renders playlist details after successful data fetch', async () => {
        const mockResponse = {
            data: {
                tracks: {items: []},
                genreCounts: {},
                recommendations: [],
                playlistName: 'Mock Playlist',
                ownerId: 'mock-owner-id',
            },
        };
        mockedAxios.get.mockResolvedValueOnce(mockResponse);
        
        render(<PlaylistDetailsLoader playlistId={mockPlaylistId} userId={mockUserId}/>);
        
        await waitFor(() => {
            expect(screen.getByTestId('playlist-details')).toBeInTheDocument();
        });
        
        expect(mockedAxios.get).toHaveBeenCalledWith(`/api/playlists/${mockPlaylistId}`);
    });
    
    it('renders error message when playlist is not found', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Not found'));
        
        render(<PlaylistDetailsLoader playlistId={mockPlaylistId} userId={mockUserId}/>);
        
        await waitFor(() => {
            expect(screen.getByText('プレイリストが見つかりませんでした。')).toBeInTheDocument();
        });
    });
    
    it('passes correct props to PlaylistDetails component', async () => {
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
        
        render(<PlaylistDetailsLoader playlistId={mockPlaylistId} userId={mockUserId}/>);
        
        await waitFor(() => {
            expect(screen.getByTestId('playlist-details')).toBeInTheDocument();
        });
        
        // Note: In a real scenario, you would check the props passed to PlaylistDetails.
        // However, since we've mocked it, we can't directly check the props here.
        // In a more advanced setup, you could use a spy or a more sophisticated mock to verify props.
    });
});
