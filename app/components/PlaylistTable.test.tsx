import {render, screen, fireEvent} from '@testing-library/react';
import PlaylistTable from './PlaylistTable';
import {Playlist} from "../types/playlist";
import '@testing-library/jest-dom';
import {expect} from "@jest/globals";

// Mock Data
const playlists: Playlist[] = [
    {
        tracks: {total: 0}, // Added total property
        id: '1',
        name: 'Playlist 1',
        description: 'Description 1',
        images: [{url: 'image1.jpg'}],
        externalUrls: {externalUrls: {spotify: 'spotify1'}}
    },
    {
        tracks: {total: 0}, // Added total property
        id: '2',
        name: 'Playlist 2',
        description: 'Description 2',
        images: [{url: 'image2.jpg'}],
        externalUrls: {externalUrls: {spotify: 'spotify2'}}
    },
];

const onPlaylistClick = jest.fn();

describe('PlaylistTable', () => {
    it('renders without crashing', () => {
        render(<PlaylistTable playlists={[]} onPlaylistClick={onPlaylistClick} currentPage={1} totalPlaylists={0}/>);
    });
    
    it('renders playlist data correctly', () => {
        render(<PlaylistTable playlists={playlists} onPlaylistClick={onPlaylistClick} currentPage={1}
                              totalPlaylists={2}/>);
        
        // Check if playlist names are displayed
        expect(screen.getByText('Playlist 1')).toBeInTheDocument();
        expect(screen.getByText('Playlist 2')).toBeInTheDocument();
        
        // Check if playlist images are displayed
        expect(screen.getByRole('img', {name: 'Playlist 1'})).toHaveAttribute('src', 'image1.jpg');
        expect(screen.getByRole('img', {name: 'Playlist 2'})).toHaveAttribute('src', 'image2.jpg');
        
        // Check if track counts are displayed
        expect(screen.getAllByText('0')).toHaveLength(2); // Use getAllByText
        
        // Check if total playlist count is displayed in the header
        expect(screen.getByText('検索結果: 2件')).toBeInTheDocument();
    });
    
    it('calls onPlaylistClick when a row is clicked', () => {
        render(<PlaylistTable playlists={playlists} onPlaylistClick={onPlaylistClick} currentPage={1}
                              totalPlaylists={2}/>);
        
        // Click on a playlist name
        fireEvent.click(screen.getByText('Playlist 1'));
        
        // Check if onPlaylistClick is called with the correct argument
        expect(onPlaylistClick).toHaveBeenCalledWith('1');
    });

    it('renders image placeholder when image url is not available', () => {
        const playlistsWithoutImage = playlists.map(playlist => ({...playlist, images: []}));
        render(<PlaylistTable playlists={playlistsWithoutImage} onPlaylistClick={onPlaylistClick} currentPage={1}
                              totalPlaylists={2}/>);
        expect(screen.getAllByTestId('image-placeholder')).toHaveLength(2); // Use getAllByTestId
    });
});
