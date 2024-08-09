import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {QueryClient, QueryClientProvider, useQuery} from '@tanstack/react-query';
import {PlaylistContextProvider, usePlaylist} from '@/app/context/PlaylistContext';
import {FavoriteContext} from '@/app/context/FavoriteContext';
import {UserContextProvider, useUser} from '@/app/context/UserContext';
import FavoritePlaylistsTable from './FavoritePlaylistsTable';
import {axe, toHaveNoViolations} from 'jest-axe';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

// モックの設定
jest.mock('@tanstack/react-query', () => ({
    ...jest.requireActual('@tanstack/react-query'),
    useQuery: jest.fn(),
}));

jest.mock('@/app/context/PlaylistContext', () => ({
    PlaylistContextProvider: ({children}: { children: React.ReactNode }) => children,
    usePlaylist: jest.fn(),
}));

jest.mock('@/app/context/UserContext', () => ({
    UserContextProvider: ({children}: { children: React.ReactNode }) => children,
    useUser: jest.fn(),
}));

jest.mock('dompurify', () => ({
    sanitize: jest.fn(content => content),
}));

jest.mock('date-fns', () => ({
    format: jest.fn(() => '2023/08/09 12:00'),
}));

// フェッチのモック
global.fetch = jest.fn();

const mockFavoritePlaylists = [
    {
        playlistId: '1',
        playlistName: 'Test Playlist 1',
        playlistOwnerName: 'Test User 1',
        totalTracks: 10,
        addedAt: '2023-08-09T12:00:00Z',
    },
    {
        playlistId: '2',
        playlistName: 'Test Playlist 2',
        playlistOwnerName: 'Test User 2',
        totalTracks: 20,
        addedAt: '2023-08-10T12:00:00Z',
    },
];

const mockFavoriteContext = {
    favorites: {},
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    fetchFavorites: jest.fn(),
};

const mockQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const renderComponent = (isLoggedIn = true, favorites = {}) => {
    (useUser as jest.Mock).mockReturnValue({
        isLoggedIn,
        userId: isLoggedIn ? 'testUserId' : null,
        error: null,
        setIsLoggedIn: jest.fn(),
        setUserId: jest.fn(),
    });
    
    (usePlaylist as jest.Mock).mockReturnValue({
        selectedPlaylistId: null,
        setSelectedPlaylistId: jest.fn(),
    });
    
    const favoriteContextValue = {
        ...mockFavoriteContext,
        favorites,
    };
    
    return render(
        <QueryClientProvider client={mockQueryClient}>
            <UserContextProvider>
                <PlaylistContextProvider>
                    <FavoriteContext.Provider value={favoriteContextValue}>
                        <FavoritePlaylistsTable/>
                    </FavoriteContext.Provider>
                </PlaylistContextProvider>
            </UserContextProvider>
        </QueryClientProvider>
    );
};

describe('FavoritePlaylistsTable', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    test('renders loading state', async () => {
        (useQuery as jest.Mock).mockReturnValue({
            isLoading: true,
            error: null,
            data: null,
        });
        
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });
    });
    
    test('renders error state', async () => {
        (useQuery as jest.Mock).mockReturnValue({
            isLoading: false,
            error: new Error('Test error'),
            data: null,
        });
        
        renderComponent();
        await waitFor(() => {
            expect(screen.getByText('Error: Test error')).toBeInTheDocument();
        });
    });
    
    test('renders favorite playlists', async () => {
        (useQuery as jest.Mock).mockReturnValue({
            isLoading: false,
            error: null,
            data: mockFavoritePlaylists,
        });
        
        renderComponent(true, {'1': true});
        
        await waitFor(() => {
            expect(screen.getByText('Test Playlist 1')).toBeInTheDocument();
            expect(screen.getByText('Test User 1')).toBeInTheDocument();
            expect(screen.getByText('10')).toBeInTheDocument();
            
            expect(screen.getByText('Test Playlist 2')).toBeInTheDocument();
            expect(screen.getByText('Test User 2')).toBeInTheDocument();
            expect(screen.getByText('20')).toBeInTheDocument();
            
            const dateElements = screen.getAllByText('2023/08/09 12:00');
            expect(dateElements).toHaveLength(2);
            
            const favoriteButtons = screen.getAllByRole('button');
            expect(favoriteButtons[0]).toHaveTextContent('★');
            expect(favoriteButtons[1]).toHaveTextContent('☆');
        });
    });
    
    test('handles favorite action', async () => {
        (useQuery as jest.Mock).mockReturnValue({
            isLoading: false,
            error: null,
            data: mockFavoritePlaylists,
            refetch: jest.fn(),
        });
        
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({}),
        });
        
        renderComponent(true, {});
        
        await waitFor(() => {
            expect(screen.getByText('Test Playlist 1')).toBeInTheDocument();
        });
        
        const favoriteButtons = screen.getAllByRole('button');
        fireEvent.click(favoriteButtons[0]);
        
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/playlists/favorite', expect.any(Object));
            expect(mockFavoriteContext.addFavorite).toHaveBeenCalledWith('1', 'Test Playlist 1', 10);
        });
    });
    
    test('handles unfavorite action', async () => {
        (useQuery as jest.Mock).mockReturnValue({
            isLoading: false,
            error: null,
            data: mockFavoritePlaylists,
            refetch: jest.fn(),
        });
        
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({}),
        });
        
        renderComponent(true, {'1': true});
        
        await waitFor(() => {
            expect(screen.getByText('Test Playlist 1')).toBeInTheDocument();
        });
        
        const favoriteButtons = screen.getAllByRole('button');
        fireEvent.click(favoriteButtons[0]);
        
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/playlists/favorite', expect.any(Object));
            expect(mockFavoriteContext.removeFavorite).toHaveBeenCalledWith('1');
        });
    });
    
    test('handles API error when favoriting/unfavoriting', async () => {
        (useQuery as jest.Mock).mockReturnValue({
            isLoading: false,
            error: null,
            data: mockFavoritePlaylists,
            refetch: jest.fn(),
        });
        
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 500,
            text: jest.fn().mockResolvedValue('Internal Server Error'),
        });
        
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });
        
        renderComponent(true, {});
        
        await waitFor(() => {
            expect(screen.getByText('Test Playlist 1')).toBeInTheDocument();
        });
        
        const favoriteButtons = screen.getAllByRole('button');
        fireEvent.click(favoriteButtons[0]);
        
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('お気に入り登録/解除中にエラーが発生しました。', expect.any(Error));
        });
        
        consoleSpy.mockRestore();
    });
    
    test('sorts table when clicking on header', async () => {
        (useQuery as jest.Mock).mockReturnValue({
            isLoading: false,
            error: null,
            data: mockFavoritePlaylists,
        });
        
        renderComponent();
        
        await waitFor(() => {
            expect(screen.getByText('Test Playlist 1')).toBeInTheDocument();
        });
        
        const playlistNameHeader = screen.getByRole('columnheader', {name: /プレイリスト名/i});
        fireEvent.click(playlistNameHeader);
        
        await waitFor(() => {
            const rows = screen.getAllByRole('row').slice(1); // ヘッダー行を除外
            expect(rows[0]).toHaveTextContent('Test Playlist 1');
            expect(rows[1]).toHaveTextContent('Test Playlist 2');
        });
        
        fireEvent.click(playlistNameHeader);
        
        await waitFor(() => {
            const rows = screen.getAllByRole('row').slice(1); // ヘッダー行を除外
            expect(rows[0]).toHaveTextContent('Test Playlist 2');
            expect(rows[1]).toHaveTextContent('Test Playlist 1');
        });
    });
    
    test('does not fetch data when user is not logged in', async () => {
        (useQuery as jest.Mock).mockReturnValue({
            isLoading: false,
            error: null,
            data: null,
        });
        
        renderComponent(false);
        
        await waitFor(() => {
            expect(useQuery).toHaveBeenCalledWith(
                expect.objectContaining({
                    enabled: false,
                })
            );
        });
    });
    
    test('has no accessibility violations', async () => {
        (useQuery as jest.Mock).mockReturnValue({
            isLoading: false,
            error: null,
            data: mockFavoritePlaylists,
        });
        
        const {container} = renderComponent();
        
        await waitFor(async () => {
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });
});
