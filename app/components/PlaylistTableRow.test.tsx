// PlaylistTableRow.test.tsx
import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {axe, toHaveNoViolations} from 'jest-axe';
import PlaylistTableRow from './PlaylistTableRow';
import {Playlist} from '../types/playlist';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

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
};

const mockEmptyImagePlaylist: Playlist = {
    id: '2',
    name: 'Empty Image Playlist',
    description: 'This playlist has no images',
    images: [],
    tracks: {
        total: 5,
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
        
        fireEvent.click(screen.getByRole('row'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    it('is accessible', async () => {
        const {container} = renderWithTable(<PlaylistTableRow playlist={mockPlaylist} onClick={jest.fn()}/>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
