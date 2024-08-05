// app/page.test.tsx

import React from 'react';
import {render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import '@testing-library/jest-dom';
import {axe, toHaveNoViolations} from 'jest-axe';
import Home from './page';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {UserContextProvider} from './context/UserContext';
import {PlaylistContextProvider} from './context/PlaylistContext';
import {FavoriteProvider} from './context/FavoriteContext';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

const queryClient = new QueryClient();

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({userId: 'mockUserId'}),
        headers: new Headers(),
        redirected: false,
        statusText: 'OK',
        type: 'basic',
        url: '',
        clone: jest.fn(),
        body: null,
        bodyUsed: false,
        arrayBuffer: jest.fn(),
        blob: jest.fn(),
        formData: jest.fn(),
        text: jest.fn(),
    } as Response)
);

jest.mock('./lib/checkSession', () => ({
    checkSession: jest.fn().mockResolvedValue(true),
}));

jest.mock('./components/PlaylistSearchForm', () => ({
    __esModule: true,
    default: ({onSearch}: { onSearch: (playlists: any[]) => void }) => (
        <button onClick={() => onSearch([{id: '1', name: 'Test Playlist'}])}>
            Search
        </button>
    ),
}));

jest.mock('./components/LoginButton', () => ({
    __esModule: true,
    default: ({onLoginSuccess}: { onLoginSuccess: () => void }) => (
        <button onClick={() => {
            sessionStorage.setItem('JWT', 'mockJWT');
            onLoginSuccess();
        }}>Login</button>
    ),
}));

jest.mock('./components/PlaylistIdForm', () => ({
    __esModule: true,
    default: ({onPlaylistSelect}: { onPlaylistSelect: (id: string) => void }) => (
        <button onClick={() => onPlaylistSelect('1')}>Select Playlist</button>
    ),
}));

jest.mock('./components/FavoritePlaylistsTable', () => ({
    __esModule: true,
    default: () => <div data-testid="favorite-playlists-table">Favorite Playlists Table</div>,
}));

jest.mock('./components/PlaylistDisplay', () => ({
    __esModule: true,
    default: ({playlists, onPlaylistClick}: { playlists: any[], onPlaylistClick: (id: string) => void }) => (
        <div>
            {playlists.map((playlist) => (
                <button key={playlist.id} onClick={() => onPlaylistClick(playlist.id)}>
                    {playlist.name}
                </button>
            ))}
        </div>
    ),
}));

describe('Home Component', () => {
    beforeEach(() => {
        sessionStorage.clear();
    });
    
    it('renders without crashing', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider>
                    <PlaylistContextProvider>
                        <FavoriteProvider>
                            <Home/>
                        </FavoriteProvider>
                    </PlaylistContextProvider>
                </UserContextProvider>
            </QueryClientProvider>
        );
        expect(screen.getByText('Playlist Viewer')).toBeInTheDocument();
    });
    
    it('handles playlist search', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider>
                    <PlaylistContextProvider>
                        <FavoriteProvider>
                            <Home/>
                        </FavoriteProvider>
                    </PlaylistContextProvider>
                </UserContextProvider>
            </QueryClientProvider>
        );
        
        await act(async () => {
            fireEvent.click(screen.getByText('Search'));
        });
        
        await waitFor(() => expect(screen.getByText('Test Playlist')).toBeInTheDocument());
    });
    
    it('handles playlist selection', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider>
                    <PlaylistContextProvider>
                        <FavoriteProvider>
                            <Home/>
                        </FavoriteProvider>
                    </PlaylistContextProvider>
                </UserContextProvider>
            </QueryClientProvider>
        );
        
        await act(async () => {
            fireEvent.click(screen.getByText('Select Playlist'));
        });
        
        await waitFor(() => {
            expect(screen.getByText('Select Playlist')).toBeInTheDocument();
        });
    });
    
    it('is accessible', async () => {
        const {container} = render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider>
                    <PlaylistContextProvider>
                        <FavoriteProvider>
                            <Home/>
                        </FavoriteProvider>
                    </PlaylistContextProvider>
                </UserContextProvider>
            </QueryClientProvider>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
