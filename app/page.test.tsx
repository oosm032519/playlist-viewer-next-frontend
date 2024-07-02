import React from 'react';
import {render, screen, waitFor, fireEvent} from '@testing-library/react';
import {axe, toHaveNoViolations} from 'jest-axe';
import Home from '../app/page';
import '@testing-library/jest-dom';

expect.extend(toHaveNoViolations);

// フェッチのモック
global.fetch = jest.fn();

// コンポーネントのモック
jest.mock('../app/components/LoginButton', () => ({
    __esModule: true,
    default: ({onLoginSuccess}: { onLoginSuccess: () => void }) => (
        <button onClick={onLoginSuccess}>Login</button>
    ),
}));

jest.mock('../app/components/PlaylistSearchForm', () => ({
    __esModule: true,
    default: ({onSearch}: { onSearch: (playlists: any[]) => void }) => (
        <form onSubmit={() => onSearch([{id: '1', name: 'Test Playlist'}])}>
            <button type="submit">Search</button>
        </form>
    ),
}));

jest.mock('../app/components/PlaylistIdForm', () => ({
    __esModule: true,
    default: ({onPlaylistSelect}: { onPlaylistSelect: (id: string) => void }) => (
        <form onSubmit={() => onPlaylistSelect('test-id')}>
            <button type="submit">Select Playlist</button>
        </form>
    ),
}));

jest.mock('../app/components/FollowedPlaylists', () => ({
    __esModule: true,
    default: () => <div>Followed Playlists</div>,
}));

jest.mock('../app/components/PlaylistTable', () => ({
    __esModule: true,
    default: ({playlists, onPlaylistClick}: { playlists: any[], onPlaylistClick: (id: string) => void }) => (
        <table>
            <tbody>
            {playlists.map(playlist => (
                <tr key={playlist.id} onClick={() => onPlaylistClick(playlist.id)}>
                    <td>{playlist.name}</td>
                </tr>
            ))}
            </tbody>
        </table>
    ),
}));

jest.mock('../app/components/PlaylistDetailsLoader', () => ({
    __esModule: true,
    default: ({playlistId, userId}: { playlistId: string, userId: string }) => (
        <div>Playlist Details: {playlistId}, User: {userId}</div>
    ),
}));

describe('Home Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('renders without crashing', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({status: 'success'}),
        });
        
        render(<Home/>);
        expect(screen.getByText('Playlist Viewer')).toBeInTheDocument();
    });
    
    it('shows login button when not logged in', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({status: 'error'}),
        });
        
        render(<Home/>);
        await waitFor(() => {
            expect(screen.getByText('Login')).toBeInTheDocument();
        });
    });
    
    it('shows followed playlists when logged in', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({status: 'success'}),
        });
        
        render(<Home/>);
        await waitFor(() => {
            expect(screen.getByText('Followed Playlists')).toBeInTheDocument();
        });
    });
    
    it('handles playlist search', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({status: 'success'}),
        });
        
        render(<Home/>);
        fireEvent.click(screen.getByText('Search'));
        
        await waitFor(() => {
            expect(screen.getByText('Test Playlist')).toBeInTheDocument();
        });
    });
    
    it('handles playlist selection', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                json: async () => ({status: 'success'}),
            })
            .mockResolvedValueOnce({
                json: async () => ({status: 'success', userId: 'test-user'}),
            });
        
        render(<Home/>);
        fireEvent.click(screen.getByText('Select Playlist'));
        
        await waitFor(() => {
            expect(screen.getByText('Playlist Details: test-id, User: test-user')).toBeInTheDocument();
        });
    });
    
    it('handles login success', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                json: async () => ({status: 'error'}),
            })
            .mockResolvedValueOnce({
                json: async () => ({status: 'success'}),
            });
        
        render(<Home/>);
        fireEvent.click(screen.getByText('Login'));
        
        await waitFor(() => {
            expect(screen.getByText('Followed Playlists')).toBeInTheDocument();
        });
    });
    
    it('has no accessibility violations', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({status: 'success'}),
        });
        
        const {container} = render(<Home/>);
        const results = await axe(container);
        
        expect(results).toHaveNoViolations();
    });
});
