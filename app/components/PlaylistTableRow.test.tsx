import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {axe, toHaveNoViolations} from 'jest-axe';
import PlaylistTableRow from './PlaylistTableRow';
import {Playlist} from '../types/playlist';
import {expect} from '@jest/globals';

// jest-axeのカスタムマッチャーを追加
expect.extend(toHaveNoViolations);

// テスト用のモックデータ: 画像ありのプレイリスト
const mockPlaylist: Playlist = {
    id: '1',
    name: 'Test Playlist',
    description: 'This is a test playlist',
    images: [
        {
            url: 'https://example.com/image.jpg',
        },
    ],
    tracks: {
        total: 10,
    },
    externalUrls: {
        externalUrls: {
            spotify: 'https://open.spotify.com/playlist/123456789',
        }
    },
};

// テスト用のモックデータ: 画像なしのプレイリスト
const mockEmptyImagePlaylist: Playlist = {
    id: '2',
    name: 'Empty Image Playlist',
    description: 'This playlist has no images',
    images: [],
    tracks: {
        total: 5,
    },
    externalUrls: {
        externalUrls: {
            spotify: 'https://open.spotify.com/playlist/123456789',
        }
    },
};

describe('PlaylistTableRow', () => {
    const renderWithTable = (component: React.ReactElement) => {
        return render(
            <table>
                <tbody>
                {component}
                </tbody>
            </table>
        );
    };
    
    it('renders playlist information correctly', () => {
        renderWithTable(<PlaylistTableRow playlist={mockPlaylist} onClick={jest.fn()}/>);
        
        expect(screen.getByAltText('Test Playlist')).toBeInTheDocument();
        expect(screen.getByText('Test Playlist')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
    });
    
    it('renders placeholder when image is not available', () => {
        renderWithTable(<PlaylistTableRow playlist={mockEmptyImagePlaylist} onClick={jest.fn()}/>);
        
        expect(screen.getByTestId('image-placeholder')).toBeInTheDocument();
        expect(screen.getByText('Empty Image Playlist')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
    });
    
    it('calls onClick when row is clicked', () => {
        const handleClick = jest.fn();
        renderWithTable(<PlaylistTableRow playlist={mockPlaylist} onClick={handleClick}/>);
        
        // 名前列またはトラック数列をクリックする
        fireEvent.click(screen.getByText('Test Playlist'));
        
        // onClickハンドラーが1回呼ばれたことを確認
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    it('is accessible', async () => {
        const {container} = renderWithTable(<PlaylistTableRow playlist={mockPlaylist} onClick={jest.fn()}/>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
