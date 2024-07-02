// app/components/FollowedPlaylists.test.tsx

import React from 'react';
import {render, screen, waitFor, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FollowedPlaylists from '../FollowedPlaylists';
import {Playlist} from '@/app/types/playlist';

// モックデータ
const mockPlaylists: Playlist[] = [
    {
        id: '1',
        name: 'Playlist 1',
        images: [{url: 'https://example.com/image1.jpg'}],
        tracks: {total: 10},
        description: ''
    },
    {
        id: '2',
        name: 'Playlist 2',
        images: [{url: 'https://example.com/image2.jpg'}],
        tracks: {total: 20},
        description: ''
    },
];

// fetchのモック
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPlaylists),
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
                json: () => Promise.resolve(mockPlaylists),
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
    
    it('fetches and displays playlists', async () => {
        await act(async () => {
            render(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        });
        
        await waitFor(() => {
            expect(screen.getByText('フォロー中のプレイリスト')).toBeInTheDocument();
        });
        
        expect(screen.getByText('Playlist 1')).toBeInTheDocument();
        expect(screen.getByText('Playlist 2')).toBeInTheDocument();
        expect(screen.getByText('トラック数: 10')).toBeInTheDocument();
        expect(screen.getByText('トラック数: 20')).toBeInTheDocument();
        
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(2);
        expect(images[0]).toHaveAttribute('src', 'https://example.com/image1.jpg');
        expect(images[1]).toHaveAttribute('src', 'https://example.com/image2.jpg');
    });
    
    it('calls onPlaylistClick when a playlist is clicked', async () => {
        render(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        
        // プレイリストが表示されるのを待つ
        await waitFor(() => {
            expect(screen.getByText('Playlist 1')).toBeInTheDocument();
        });
        
        // プレイリストをクリック
        const playlistElement = screen.getByText('Playlist 1');
        await userEvent.click(playlistElement);
        
        // onPlaylistClickが呼び出されるのを待つ
        await waitFor(() => {
            expect(mockOnPlaylistClick).toHaveBeenCalledWith('1');
        });
    });
});
    
    it('displays an error message when fetch fails', async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.reject(new Error('API request failed'))
        );
        
        await act(async () => {
            render(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        });
        
        await waitFor(() => {
            expect(screen.getByText('Error')).toBeInTheDocument();
            expect(screen.getByText('フォロー中のプレイリストの取得中にエラーが発生しました。')).toBeInTheDocument();
        });
    });
