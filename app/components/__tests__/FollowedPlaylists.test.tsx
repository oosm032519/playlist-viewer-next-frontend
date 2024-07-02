// app/components/FollowedPlaylists.test.tsx

import React from 'react';
import {render, screen, waitFor, act, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FollowedPlaylists from '../FollowedPlaylists';
import {Playlist} from '@/app/types/playlist';
import {axe, toHaveNoViolations} from 'jest-axe';

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
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({items: mockPlaylists}),
    } as Response)
);

// onPlaylistClickのモック関数
const mockOnPlaylistClick = jest.fn();

describe('FollowedPlaylists', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('renders loading spinner initially', async () => {
        // fetchのモックを遅延させる
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            new Promise(resolve => setTimeout(() => resolve({
                ok: true,
                json: () => Promise.resolve({items: mockPlaylists}),
            }), 100))
        );
        
        render(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        
        // LoadingSpinnerが表示されるのを待つ
        const spinner = await screen.findByRole('progressbar');
        expect(spinner).toBeInTheDocument();
        
        // プレイリストが表示されるのを待つ
        await waitFor(() => {
            expect(screen.getByText('フォロー中のプレイリスト')).toBeInTheDocument();
        });
    });
    
    it('fetches and displays playlists correctly', async () => {
        await act(async () => {
            render(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        });
        
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
        render(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        
        // プレイリストが表示されるのを待つ
        await waitFor(() => {
            expect(screen.getByText('Playlist 1')).toBeInTheDocument();
        });
        
        // 各プレイリストをクリックしてテスト
        for (const playlist of mockPlaylists) {
            const playlistElement = screen.getByText(playlist.name);
            await userEvent.click(playlistElement);
            
            // onPlaylistClickが正しい引数で呼び出されたことを確認
            expect(mockOnPlaylistClick).toHaveBeenCalledWith(playlist.id);
            
            // モック関数をリセット
            mockOnPlaylistClick.mockClear();
        }
    });
    
    it('displays correct number of playlists', async () => {
        render(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        
        await waitFor(() => {
            const playlists = screen.getAllByRole('listitem');
            expect(playlists).toHaveLength(mockPlaylists.length);
        });
    });
    
    it('displays an error message when fetch fails', async () => {
        const errorMessage = 'API request failed';
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.reject(new Error(errorMessage))
        );
        
        render(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        
        await waitFor(() => {
            expect(screen.getByText('フォロー中のプレイリストの取得中にエラーが発生しました。')).toBeInTheDocument();
        });
    });
    
    it('handles empty playlist response', async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([]),
            } as Response)
        );
        
        render(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        
        await waitFor(() => {
            expect(screen.getByText('フォロー中のプレイリスト')).toBeInTheDocument();
        });
        
        expect(screen.getByText('フォロー中のプレイリストはありません。')).toBeInTheDocument();
    });
    
    it('has no accessibility violations', async () => {
        const {container} = render(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        
        await waitFor(() => {
            expect(screen.getByText('フォロー中のプレイリスト')).toBeInTheDocument();
        });
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    it('matches snapshot', async () => {
        const {asFragment} = render(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        
        await waitFor(() => {
            expect(screen.getByText('フォロー中のプレイリスト')).toBeInTheDocument();
        });
        
        expect(asFragment()).toMatchSnapshot();
    });
});
