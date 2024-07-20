// app/components/PlaylistTable.test.tsx

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
        // PlaylistTableコンポーネントをレンダリング
        render(<PlaylistTable playlists={mockPlaylists} onPlaylistClick={mockOnPlaylistClick} currentPage={1}
                              totalPlaylists={20}/>);
        
        // テーブルヘッダーが正しく表示されているか確認
        expect(screen.getByRole('columnheader', {name: 'Image'})).toBeInTheDocument();
        expect(screen.getByRole('columnheader', {name: 'Name'})).toBeInTheDocument();
        expect(screen.getByRole('columnheader', {name: 'Tracks'})).toBeInTheDocument();
    });
    
    it('renders the correct number of playlists', () => {
        // PlaylistTableコンポーネントをレンダリング
        render(<PlaylistTable playlists={mockPlaylists} onPlaylistClick={mockOnPlaylistClick} currentPage={1}
                              totalPlaylists={20}/>);
        
        // プレイリストの行数が正しいか確認（ヘッダー行を除外）
        const playlistRows = screen.getAllByRole('row').slice(1);
        expect(playlistRows).toHaveLength(mockPlaylists.length);
    });
    
    it('displays playlist information correctly', () => {
        // PlaylistTableコンポーネントをレンダリング
        render(<PlaylistTable playlists={mockPlaylists} onPlaylistClick={mockOnPlaylistClick} currentPage={1}
                              totalPlaylists={20}/>);
        
        // 各プレイリストの情報が正しく表示されているか確認
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
        // PlaylistTableコンポーネントをレンダリング
        render(<PlaylistTable playlists={mockPlaylists} onPlaylistClick={mockOnPlaylistClick} currentPage={1}
                              totalPlaylists={20}/>);
        
        // プレイリストの行をクリックしたときに正しいIDが渡されるか確認
        mockPlaylists.forEach((playlist, index) => {
            const row = screen.getByRole('row', {name: new RegExp(playlist.name)});
            fireEvent.click(row);
            expect(mockOnPlaylistClick).toHaveBeenNthCalledWith(index + 1, playlist.id);
        });
    });
    
    it('renders empty table when no playlists are provided', () => {
        // プレイリストが提供されていない場合のテーブルのレンダリング
        render(<PlaylistTable playlists={[]} onPlaylistClick={mockOnPlaylistClick} currentPage={1}
                              totalPlaylists={20}/>);
        
        // プレイリストの行がないことを確認（ヘッダー行を除外）
        const playlistRows = screen.getAllByRole('row').slice(1);
        expect(playlistRows).toHaveLength(0);
    });
    
    it('handles playlists without images correctly', () => {
        // 画像がないプレイリストを含む場合のテーブルのレンダリング
        render(<PlaylistTable playlists={[mockPlaylistWithoutImage]} onPlaylistClick={mockOnPlaylistClick}
                              currentPage={1} totalPlaylists={20}/>);
        
        // 画像がない場合のプレースホルダーが正しく表示されているか確認
        const row = screen.getByRole('row', {name: /Playlist 3/});
        const image = within(row).queryByRole('img');
        expect(image).not.toBeInTheDocument();
        
        const placeholder = within(row).getByTestId('image-placeholder');
        expect(placeholder).toBeInTheDocument();
        expect(placeholder).toHaveClass('w-12', 'h-12', 'bg-gray-200', 'rounded-full');
    });
    
    it('is accessible', async () => {
        // PlaylistTableコンポーネントをレンダリング
        const {container} = render(<PlaylistTable playlists={mockPlaylists} onPlaylistClick={mockOnPlaylistClick}
                                                  currentPage={1} totalPlaylists={20}/>);
        
        // アクセシビリティの検証
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    it('renders correctly with a large number of playlists', () => {
        // 多数のプレイリストを含む場合のテーブルのレンダリング
        const manyPlaylists = Array.from({length: 100}, (_, i) => ({
            id: `${i + 1}`,
            name: `Playlist ${i + 1}`,
            images: [{url: `https://example.com/image${i + 1}.jpg`}],
            tracks: {total: (i + 1) * 10},
            description: `Description ${i + 1}`
        }));
        
        render(<PlaylistTable playlists={manyPlaylists} onPlaylistClick={mockOnPlaylistClick} currentPage={1}
                              totalPlaylists={20}/>);
        
        // プレイリストの行数が正しいか確認（ヘッダー行を除外）
        const playlistRows = screen.getAllByRole('row').slice(1);
        expect(playlistRows).toHaveLength(100);
    });
});
