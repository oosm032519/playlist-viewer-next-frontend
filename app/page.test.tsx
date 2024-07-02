// app/__tests__/Home.test.tsx

import React from 'react';
import {render, screen, waitFor, fireEvent} from '@testing-library/react';
import {axe, toHaveNoViolations} from 'jest-axe';
import Home from './page';
import '@testing-library/jest-dom';

expect.extend(toHaveNoViolations);

// フェッチのモック
const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockSuccessResponse = {
    status: 'success',
    userId: 'test-user-id',
};

const mockErrorResponse = {
    status: 'error',
    message: 'An error occurred',
};

// コンポーネントのモック
jest.mock('../components/LoginButton', () => {
    return {
        __esModule: true,
        default: jest.fn(({onLoginSuccess}) => (
            <button onClick={onLoginSuccess}>Login</button>
        )),
    };
});

jest.mock('../components/PlaylistSearchForm', () => {
    return {
        __esModule: true,
        default: jest.fn(({onSearch}) => (
            <form onSubmit={() => onSearch([{id: '1', name: 'Test Playlist'}])}>
                <input type="text" placeholder="Search playlists"/>
                <button type="submit">Search</button>
            </form>
        )),
    };
});

jest.mock('../components/PlaylistIdForm', () => {
    return {
        __esModule: true,
        default: jest.fn(({onPlaylistSelect}) => (
            <form onSubmit={() => onPlaylistSelect('test-id')}>
                <button type="submit">Select Playlist</button>
            </form>
        )),
    };
});

jest.mock('../components/FollowedPlaylists', () => {
    return {
        __esModule: true,
        default: jest.fn(() => <div>Followed Playlists</div>),
    };
});

jest.mock('../components/PlaylistTable', () => {
    return {
        __esModule: true,
        default: jest.fn(({playlists, onPlaylistClick}) => (
            <table>
                <tbody>
                {playlists.map((playlist: { id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }) => (
                    <tr key={playlist.id} onClick={() => onPlaylistClick(playlist.id)}>
                        <td>{playlist.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        )),
    };
});

jest.mock('../components/PlaylistDetailsLoader', () => {
    return {
        __esModule: true,
        default: jest.fn(({playlistId, userId}) => (
            <div>Playlist Details: {playlistId}, User: {userId}</div>
        )),
    };
});

describe('Home Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFetch.mockClear();
    });
    
    describe('Rendering', () => {
        it('renders without crashing', async () => {
            mockFetch.mockResolvedValueOnce({
                json: async () => mockSuccessResponse,
            });
            
            render(<Home/>);
            expect(screen.getByText('Playlist Viewer')).toBeInTheDocument();
        });
        
        it('shows login button when not logged in', async () => {
            mockFetch.mockResolvedValueOnce({
                json: async () => mockErrorResponse,
            });
            
            render(<Home/>);
            await waitFor(() => {
                expect(screen.getByText('Login')).toBeInTheDocument();
            });
        });
        
        it('shows followed playlists when logged in', async () => {
            mockFetch.mockResolvedValueOnce({
                json: async () => mockSuccessResponse,
            });
            
            render(<Home/>);
            await waitFor(() => {
                expect(screen.getByText('Followed Playlists')).toBeInTheDocument();
            });
        });
        
        it('does not show followed playlists when not logged in', async () => {
            mockFetch.mockResolvedValueOnce({
                json: async () => mockErrorResponse,
            });
            
            render(<Home/>);
            await waitFor(() => {
                expect(screen.queryByText('Followed Playlists')).not.toBeInTheDocument();
            });
        });
    });
    
    describe('Error Handling', () => {
        it('displays error message when fetch fails', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));
            
            render(<Home/>);
            await waitFor(() => {
                expect(screen.getByText('Error')).toBeInTheDocument();
                expect(screen.getByText('An error occurred')).toBeInTheDocument();
            });
        });
        
        it('displays error message when API returns error', async () => {
            mockFetch.mockResolvedValueOnce({
                json: async () => ({status: 'error', message: 'API error'}),
            });
            
            render(<Home/>);
            await waitFor(() => {
                expect(screen.getByText('Error')).toBeInTheDocument();
                expect(screen.getByText('API error')).toBeInTheDocument();
            });
        });
    });
    
    describe('User Interactions', () => {
        it('handles playlist search', async () => {
            mockFetch.mockResolvedValueOnce({
                json: async () => mockSuccessResponse,
            });
            
            render(<Home/>);
            fireEvent.change(screen.getByPlaceholderText('Search playlists'), {target: {value: 'Test'}});
            fireEvent.click(screen.getByText('Search'));
            
            await waitFor(() => {
                expect(screen.getByText('Test Playlist')).toBeInTheDocument();
            });
        });
        
        it('handles playlist selection', async () => {
            mockFetch
                .mockResolvedValueOnce({
                    json: async () => mockSuccessResponse,
                })
                .mockResolvedValueOnce({
                    json: async () => ({...mockSuccessResponse, userId: 'test-user'}),
                });
            
            render(<Home/>);
            fireEvent.click(screen.getByText('Select Playlist'));
            
            await waitFor(() => {
                expect(screen.getByText('Playlist Details: test-id, User: test-user')).toBeInTheDocument();
            });
        });
        
        it('handles login success', async () => {
            mockFetch
                .mockResolvedValueOnce({
                    json: async () => mockErrorResponse,
                })
                .mockResolvedValueOnce({
                    json: async () => mockSuccessResponse,
                });
            
            render(<Home/>);
            fireEvent.click(screen.getByText('Login'));
            
            await waitFor(() => {
                expect(screen.getByText('Followed Playlists')).toBeInTheDocument();
            });
        });
    });
    
    describe('Asynchronous Operations', () => {
        it('fetches user data on initial load', async () => {
            mockFetch.mockResolvedValueOnce({
                json: async () => mockSuccessResponse,
            });
            
            render(<Home/>);
            
            await waitFor(() => {
                expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/session/check', expect.any(Object));
            });
        });
        
        it('refetches user data after successful login', async () => {
            mockFetch
                .mockResolvedValueOnce({
                    json: async () => mockErrorResponse,
                })
                .mockResolvedValueOnce({
                    json: async () => mockSuccessResponse,
                })
                .mockResolvedValueOnce({
                    json: async () => ({...mockSuccessResponse, userId: 'new-user-id'}),
                });
            
            render(<Home/>);
            fireEvent.click(screen.getByText('Login'));
            
            await waitFor(() => {
                expect(mockFetch).toHaveBeenCalledTimes(3);
                expect(screen.getByText('Followed Playlists')).toBeInTheDocument();
            });
        });
    });
    
    describe('Accessibility', () => {
        it('has no accessibility violations', async () => {
            mockFetch.mockResolvedValueOnce({
                json: async () => mockSuccessResponse,
            });
            
            const {container} = render(<Home/>);
            const results = await axe(container);
            
            expect(results).toHaveNoViolations();
        });
        
        it('has proper heading structure', async () => {
            mockFetch.mockResolvedValueOnce({
                json: async () => mockSuccessResponse,
            });
            
            render(<Home/>);
            
            const heading = screen.getByRole('heading', {name: 'Playlist Viewer'});
            expect(heading).toBeInTheDocument();
            expect(heading.tagName).toBe('H1');
        });
        
        it('has proper button labels', async () => {
            mockFetch.mockResolvedValueOnce({
                json: async () => mockSuccessResponse,
            });
            
            render(<Home/>);
            
            const loginButton = screen.getByRole('button', {name: 'Login'});
            expect(loginButton).toBeInTheDocument();
            
            const searchButton = screen.getByRole('button', {name: 'Search'});
            expect(searchButton).toBeInTheDocument();
        });
    });
});
