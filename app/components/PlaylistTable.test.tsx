// PlaylistTable.test.tsx

import React from 'react';
import {render, screen, fireEvent, within} from '@testing-library/react';
import {axe, toHaveNoViolations} from 'jest-axe';
import '@testing-library/jest-dom';
import PlaylistTable from './PlaylistTable';
import {Playlist} from '../types/playlist';
import {expect} from '@jest/globals';

// jest-axeのマッチャーを追加
expect.extend(toHaveNoViolations);

// モックデータの作成
const mockPlaylists: Playlist[] = [
    {
        id: '1',
        name: 'Playlist 1',
        images: [{url: 'https://example.com/image1.jpg'}],
        tracks: {total: 10},
        description: 'Description 1'
    },
    {
        id: '2',
        name: 'Playlist 2',
        images: [{url: 'https://example.com/image2.jpg'}],
        tracks: {total: 20},
        description: 'Description 2'
    },
];

const mockPlaylistWithoutImage: Playlist = {
    id: '3',
    name: 'Playlist 3',
    images: [],
    tracks: {total: 30},
    description: 'Description 3'
};

describe('PlaylistTable', () => {
    // onPlaylistClickのモック関数を作成
    const mockOnPlaylistClick = jest.fn();
    
    // 各テストの前にモック関数をリセット
    beforeEach(() => {
        mockOnPlaylistClick.mockClear();
    });
    
    it('renders the table headers correctly', () => {
        render(<PlaylistTable playlists={mockPlaylists} onPlaylistClick={mockOnPlaylistClick}/>);
        
        expect(screen.getByRole('columnheader', {name: 'Image'})).toBeInTheDocument();
        expect(screen.getByRole('columnheader', {name: 'Name'})).toBeInTheDocument();
        expect(screen.getByRole('columnheader', {name: 'Tracks'})).toBeInTheDocument();
    });
    
    it('renders the correct number of playlists', () => {
        render(<PlaylistTable playlists={mockPlaylists} onPlaylistClick={mockOnPlaylistClick}/>);
        
        const playlistRows = screen.getAllByRole('row').slice(1); // ヘッダー行を除外
        expect(playlistRows).toHaveLength(mockPlaylists.length);
    });
    
    it('displays playlist information correctly', () => {
        render(<PlaylistTable playlists={mockPlaylists} onPlaylistClick={mockOnPlaylistClick}/>);
        
        mockPlaylists.forEach((playlist) => {
            const row = screen.getByRole('row', {name: new RegExp(playlist.name)});
            expect(within(row).getByText(playlist.name)).toBeInTheDocument();
            expect(within(row).getByText(playlist.tracks.total.toString())).toBeInTheDocument();
            const image = within(row).getByRole('img', {name: playlist.name}) as HTMLImageElement;
            expect(image).toBeInTheDocument();
            expect(image.src).toBe(playlist.images[0].url);
        });
    });
    
    it('calls onPlaylistClick with correct playlist ID when a row is clicked', () => {
        render(<PlaylistTable playlists={mockPlaylists} onPlaylistClick={mockOnPlaylistClick}/>);
        
        mockPlaylists.forEach((playlist, index) => {
            const row = screen.getByRole('row', {name: new RegExp(playlist.name)});
            fireEvent.click(row);
            expect(mockOnPlaylistClick).toHaveBeenNthCalledWith(index + 1, playlist.id);
        });
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
    
    it('handles playlists without images correctly', () => {
        render(<PlaylistTable playlists={[mockPlaylistWithoutImage]} onPlaylistClick={mockOnPlaylistClick}/>);
        
        const row = screen.getByRole('row', {name: /Playlist 3/});
        const image = within(row).queryByRole('img');
        expect(image).not.toBeInTheDocument();
        
        const placeholder = within(row).getByTestId('image-placeholder');
        expect(placeholder).toBeInTheDocument();
        expect(placeholder).toHaveClass('w-12', 'h-12', 'bg-gray-200', 'rounded-full');
    });
    
    it('is accessible', async () => {
        const {container} = render(<PlaylistTable playlists={mockPlaylists} onPlaylistClick={mockOnPlaylistClick}/>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    it('renders correctly with a large number of playlists', () => {
        const manyPlaylists = Array.from({length: 100}, (_, i) => ({
            id: `${i + 1}`,
            name: `Playlist ${i + 1}`,
            images: [{url: `https://example.com/image${i + 1}.jpg`}],
            tracks: {total: (i + 1) * 10},
            description: `Description ${i + 1}`
        }));
        
        render(<PlaylistTable playlists={manyPlaylists} onPlaylistClick={mockOnPlaylistClick}/>);
        
        const playlistRows = screen.getAllByRole('row').slice(1); // ヘッダー行を除外
        expect(playlistRows).toHaveLength(100);
    });
    
    it('matches snapshot', () => {
        const {container} = render(<PlaylistTable playlists={mockPlaylists} onPlaylistClick={mockOnPlaylistClick}/>);
        expect(container).toMatchSnapshot();
    });
});
