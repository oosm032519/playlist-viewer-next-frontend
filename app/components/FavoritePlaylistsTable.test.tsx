import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {FavoriteContext} from '@/app/context/FavoriteContext';
import {PlaylistContextProvider} from '@/app/context/PlaylistContext';
import FavoritePlaylistsTable from './FavoritePlaylistsTable';
import {axe, toHaveNoViolations} from 'jest-axe';
import {useQuery} from '@tanstack/react-query';
import * as PlaylistContext from '@/app/context/PlaylistContext';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

// モックの設定
jest.mock('@tanstack/react-query', () => ({
    ...jest.requireActual('@tanstack/react-query'),
    useQuery: jest.fn(),
}));

jest.mock('@/app/context/PlaylistContext', () => ({
    ...jest.requireActual('@/app/context/PlaylistContext'),
    usePlaylist: jest.fn(),
}));

global.fetch = jest.fn();

describe('FavoritePlaylistsTable', () => {
    let queryClient: QueryClient;
    let mockSetSelectedPlaylistId: jest.Mock;
    
    beforeEach(() => {
        queryClient = new QueryClient();
        jest.clearAllMocks();
        (useQuery as jest.Mock).mockReset();
        
        mockSetSelectedPlaylistId = jest.fn();
        (PlaylistContext.usePlaylist as jest.Mock).mockReturnValue({
            setSelectedPlaylistId: mockSetSelectedPlaylistId,
        });
    });
    
    it('renders loading state', () => {
        (useQuery as jest.Mock).mockReturnValue({isLoading: true});
        
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistContextProvider>
                    <FavoriteContext.Provider value={{
                        favorites: {},
                        addFavorite: jest.fn(),
                        removeFavorite: jest.fn(),
                        fetchFavorites: jest.fn()
                    }}>
                        <FavoritePlaylistsTable/>
                    </FavoriteContext.Provider>
                </PlaylistContextProvider>
            </QueryClientProvider>
        );
        
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
    
    it('renders error state', () => {
        const errorMessage = 'Failed to fetch playlists';
        (useQuery as jest.Mock).mockReturnValue({isLoading: false, error: new Error(errorMessage)});
        
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistContextProvider>
                    <FavoriteContext.Provider value={{
                        favorites: {},
                        addFavorite: jest.fn(),
                        removeFavorite: jest.fn(),
                        fetchFavorites: jest.fn()
                    }}>
                        <FavoritePlaylistsTable/>
                    </FavoriteContext.Provider>
                </PlaylistContextProvider>
            </QueryClientProvider>
        );
        
        expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
    
    it('renders playlist data correctly', async () => {
        const mockPlaylists = [
            {
                playlistId: '1',
                playlistName: 'Playlist 1',
                playlistOwnerName: 'User 1',
                totalTracks: 10,
                addedAt: '2023-07-23T12:00:00Z'
            },
            {
                playlistId: '2',
                playlistName: 'Playlist 2',
                playlistOwnerName: 'User 2',
                totalTracks: 20,
                addedAt: '2023-07-23T13:00:00Z'
            },
        ];
        
        (useQuery as jest.Mock).mockReturnValue({isLoading: false, data: mockPlaylists});
        
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistContextProvider>
                    <FavoriteContext.Provider value={{
                        favorites: {},
                        addFavorite: jest.fn(),
                        removeFavorite: jest.fn(),
                        fetchFavorites: jest.fn()
                    }}>
                        <FavoritePlaylistsTable/>
                    </FavoriteContext.Provider>
                </PlaylistContextProvider>
            </QueryClientProvider>
        );
        
        await waitFor(() => {
            expect(screen.getByText('Playlist 1')).toBeInTheDocument();
            expect(screen.getByText('Playlist 2')).toBeInTheDocument();
            expect(screen.getByText('User 1')).toBeInTheDocument();
            expect(screen.getByText('User 2')).toBeInTheDocument();
            expect(screen.getByText('10')).toBeInTheDocument();
            expect(screen.getByText('20')).toBeInTheDocument();
        });
    });
    
    it('handles favorite/unfavorite actions', async () => {
        const mockPlaylists = [
            {
                playlistId: '1',
                playlistName: 'Playlist 1',
                playlistOwnerName: 'User 1',
                totalTracks: 10,
                addedAt: '2023-07-23T12:00:00Z'
            },
        ];
        
        const mockAddFavorite = jest.fn();
        const mockRemoveFavorite = jest.fn();
        
        (useQuery as jest.Mock).mockReturnValue({isLoading: false, data: mockPlaylists});
        (global.fetch as jest.Mock).mockResolvedValue({ok: true});
        
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistContextProvider>
                    <FavoriteContext.Provider value={{
                        favorites: {},
                        addFavorite: mockAddFavorite,
                        removeFavorite: mockRemoveFavorite,
                        fetchFavorites: jest.fn()
                    }}>
                        <FavoritePlaylistsTable/>
                    </FavoriteContext.Provider>
                </PlaylistContextProvider>
            </QueryClientProvider>
        );
        
        const favoriteButton = screen.getByText('☆');
        fireEvent.click(favoriteButton);
        
        await waitFor(() => {
            expect(mockAddFavorite).toHaveBeenCalledWith('1', 'Playlist 1', 10);
        });
        
        // お気に入り解除のテスト
        (global.fetch as jest.Mock).mockResolvedValue({ok: true});
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistContextProvider>
                    <FavoriteContext.Provider value={{
                        favorites: {
                            '1': {
                                playlistName: 'Playlist 1',
                                totalTracks: 10,
                                addedAt: '2023-07-23T12:00:00Z'
                            }
                        }, addFavorite: mockAddFavorite, removeFavorite: mockRemoveFavorite, fetchFavorites: jest.fn()
                    }}>
                        <FavoritePlaylistsTable/>
                    </FavoriteContext.Provider>
                </PlaylistContextProvider>
            </QueryClientProvider>
        );
        
        const unfavoriteButton = screen.getByText('★');
        fireEvent.click(unfavoriteButton);
        
        await waitFor(() => {
            expect(mockRemoveFavorite).toHaveBeenCalledWith('1');
        });
    });
    
    it('sets selected playlist when row is clicked', async () => {
        const mockPlaylists = [
            {
                playlistId: '1',
                playlistName: 'Playlist 1',
                playlistOwnerName: 'User 1',
                totalTracks: 10,
                addedAt: '2023-07-23T12:00:00Z'
            },
        ];
        
        (useQuery as jest.Mock).mockReturnValue({isLoading: false, data: mockPlaylists});
        
        render(
            <QueryClientProvider client={queryClient}>
                <FavoriteContext.Provider value={{
                    favorites: {},
                    addFavorite: jest.fn(),
                    removeFavorite: jest.fn(),
                    fetchFavorites: jest.fn()
                }}>
                    <FavoritePlaylistsTable/>
                </FavoriteContext.Provider>
            </QueryClientProvider>
        );
        
        const playlistRow = screen.getByText('Playlist 1').closest('tr');
        if (playlistRow) {
            fireEvent.click(playlistRow);
        }
        
        await waitFor(() => {
            expect(mockSetSelectedPlaylistId).toHaveBeenCalledWith('1');
        });
    });
    
    it('has no accessibility violations', async () => {
        const mockPlaylists = [
            {
                playlistId: '1',
                playlistName: 'Playlist 1',
                playlistOwnerName: 'User 1',
                totalTracks: 10,
                addedAt: '2023-07-23T12:00:00Z'
            },
        ];
        
        (useQuery as jest.Mock).mockReturnValue({isLoading: false, data: mockPlaylists});
        
        const {container} = render(
            <QueryClientProvider client={queryClient}>
                <PlaylistContextProvider>
                    <FavoriteContext.Provider value={{
                        favorites: {},
                        addFavorite: jest.fn(),
                        removeFavorite: jest.fn(),
                        fetchFavorites: jest.fn()
                    }}>
                        <FavoritePlaylistsTable/>
                    </FavoriteContext.Provider>
                </PlaylistContextProvider>
            </QueryClientProvider>
        );
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    it('renders empty state when no playlists', async () => {
        (useQuery as jest.Mock).mockReturnValue({isLoading: false, data: []});
        
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistContextProvider>
                    <FavoriteContext.Provider value={{
                        favorites: {},
                        addFavorite: jest.fn(),
                        removeFavorite: jest.fn(),
                        fetchFavorites: jest.fn()
                    }}>
                        <FavoritePlaylistsTable/>
                    </FavoriteContext.Provider>
                </PlaylistContextProvider>
            </QueryClientProvider>
        );
        
        expect(screen.queryByRole('table')).toBeInTheDocument();
        expect(screen.queryByText('プレイリスト名')).toBeInTheDocument();
        expect(screen.queryByText('Playlist 1')).not.toBeInTheDocument();
    });
    
    it('sorts playlists when header is clicked', async () => {
        const mockPlaylists = [
            {
                playlistId: '1',
                playlistName: 'B Playlist',
                playlistOwnerName: 'User 1',
                totalTracks: 10,
                addedAt: '2023-07-23T12:00:00Z'
            },
            {
                playlistId: '2',
                playlistName: 'A Playlist',
                playlistOwnerName: 'User 2',
                totalTracks: 20,
                addedAt: '2023-07-23T13:00:00Z'
            },
        ];
        
        (useQuery as jest.Mock).mockReturnValue({isLoading: false, data: mockPlaylists});
        
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistContextProvider>
                    <FavoriteContext.Provider value={{
                        favorites: {},
                        addFavorite: jest.fn(),
                        removeFavorite: jest.fn(),
                        fetchFavorites: jest.fn()
                    }}>
                        <FavoritePlaylistsTable/>
                    </FavoriteContext.Provider>
                </PlaylistContextProvider>
            </QueryClientProvider>
        );
        
        const playlistNameHeader = screen.getByText('プレイリスト名');
        fireEvent.click(playlistNameHeader);
        
        await waitFor(() => {
            const playlistNames = screen.getAllByRole('cell', {name: /Playlist/});
            expect(playlistNames[0]).toHaveTextContent('A Playlist');
            expect(playlistNames[1]).toHaveTextContent('B Playlist');
        });
    });
    
    it('handles API error when fetching playlists', async () => {
        const errorMessage = 'Failed to fetch playlists';
        (useQuery as jest.Mock).mockReturnValue({
            isLoading: false,
            error: new Error(errorMessage),
            refetch: jest.fn()
        });
        
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistContextProvider>
                    <FavoriteContext.Provider value={{
                        favorites: {},
                        addFavorite: jest.fn(),
                        removeFavorite: jest.fn(),
                        fetchFavorites: jest.fn()
                    }}>
                        <FavoritePlaylistsTable/>
                    </FavoriteContext.Provider>
                </PlaylistContextProvider>
            </QueryClientProvider>
        );
        
        expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
    
    it('handles API error when adding/removing favorite', async () => {
        const mockPlaylists = [
            {
                playlistId: '1',
                playlistName: 'Playlist 1',
                playlistOwnerName: 'User 1',
                totalTracks: 10,
                addedAt: '2023-07-23T12:00:00Z'
            },
        ];
        
        const mockAddFavorite = jest.fn();
        const mockRemoveFavorite = jest.fn();
        
        (useQuery as jest.Mock).mockReturnValue({isLoading: false, data: mockPlaylists});
        (global.fetch as jest.Mock).mockResolvedValue({ok: false, status: 500});
        
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistContextProvider>
                    <FavoriteContext.Provider value={{
                        favorites: {},
                        addFavorite: mockAddFavorite,
                        removeFavorite: mockRemoveFavorite,
                        fetchFavorites: jest.fn()
                    }}>
                        <FavoritePlaylistsTable/>
                    </FavoriteContext.Provider>
                </PlaylistContextProvider>
            </QueryClientProvider>
        );
        
        const favoriteButton = screen.getByText('☆');
        fireEvent.click(favoriteButton);
        
        await waitFor(() => {
            expect(mockAddFavorite).not.toHaveBeenCalled();
        });
    });
});
