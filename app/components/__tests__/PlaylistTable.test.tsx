// PlaylistTable.test.tsx

import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import PlaylistTable from '../PlaylistTable';
import {Playlist} from '@/app/types/playlist';

// モックデータの作成
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

describe('PlaylistTable', () => {
    // onPlaylistClickのモック関数を作成
    const mockOnPlaylistClick = jest.fn();
    
    // 各テストの前にモック関数をリセット
    beforeEach(() => {
        mockOnPlaylistClick.mockClear();
    });
    
    it('renders the table headers correctly', () => {
        render(<PlaylistTable playlists={mockPlaylists} onPlaylistClick={mockOnPlaylistClick}/>);
        
        expect(screen.getByText('Image')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Tracks')).toBeInTheDocument();
    });
    
    it('renders the correct number of playlists', () => {
        render(<PlaylistTable playlists={mockPlaylists} onPlaylistClick={mockOnPlaylistClick}/>);
        
        const playlistRows = screen.getAllByRole('row').slice(1); // ヘッダー行を除外
        expect(playlistRows).toHaveLength(mockPlaylists.length);
    });
    
    it('displays playlist information correctly', () => {
        render(<PlaylistTable playlists={mockPlaylists} onPlaylistClick={mockOnPlaylistClick}/>);
        
        mockPlaylists.forEach((playlist) => {
            expect(screen.getByText(playlist.name)).toBeInTheDocument();
            expect(screen.getByText(playlist.tracks.total.toString())).toBeInTheDocument();
            const image = screen.getByAltText(playlist.name) as HTMLImageElement;
            expect(image).toBeInTheDocument();
            expect(image.src).toBe(playlist.images[0].url);
        });
    });
    
    it('calls onPlaylistClick with correct playlist ID when a row is clicked', () => {
        render(<PlaylistTable playlists={mockPlaylists} onPlaylistClick={mockOnPlaylistClick}/>);
        
        const playlistRows = screen.getAllByRole('row').slice(1); // ヘッダー行を除外
        fireEvent.click(playlistRows[0]);
        expect(mockOnPlaylistClick).toHaveBeenCalledWith(mockPlaylists[0].id);
        
        fireEvent.click(playlistRows[1]);
        expect(mockOnPlaylistClick).toHaveBeenCalledWith(mockPlaylists[1].id);
    });
    
    it('renders empty table when no playlists are provided', () => {
        render(<PlaylistTable playlists={[]} onPlaylistClick={mockOnPlaylistClick}/>);
        
        const playlistRows = screen.getAllByRole('row').slice(1); // ヘッダー行を除外
        expect(playlistRows).toHaveLength(0);
    });
    
    it('applies correct CSS classes to table elements', () => {
        render(<PlaylistTable playlists={mockPlaylists} onPlaylistClick={mockOnPlaylistClick}/>);
        
        const images = screen.getAllByRole('img');
        images.forEach((img) => {
            expect(img).toHaveClass('w-12', 'h-12', 'object-cover', 'rounded-full');
        });
    });
});
