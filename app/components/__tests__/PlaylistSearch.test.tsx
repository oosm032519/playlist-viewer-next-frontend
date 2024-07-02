import React from 'react';
import {render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import PlaylistSearch from '../PlaylistSearch';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockPlaylists = [
    {
        id: '1',
        name: 'Test Playlist 1',
        description: 'Test Description 1',
        images: [{url: 'https://example.com/image1.jpg'}],
    },
    {
        id: '2',
        name: 'Test Playlist 2',
        description: 'Test Description 2',
        images: [{url: 'https://example.com/image2.jpg'}],
    },
];

describe('PlaylistSearch Component', () => {
    beforeEach(() => {
        mockedAxios.get.mockReset();
    });
    
    test('renders PlaylistSearch component', () => {
        render(<PlaylistSearch/>);
        expect(screen.getByText('Playlist Search')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter playlist name')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Search'})).toBeInTheDocument();
    });
    
    test('displays error message for invalid input', async () => {
        render(<PlaylistSearch/>);
        const input = screen.getByPlaceholderText('Enter playlist name');
        const searchButton = screen.getByRole('button', {name: 'Search'});
        
        await act(async () => {
            await userEvent.type(input, 'a');
            fireEvent.click(searchButton);
        });
        
        await waitFor(() => {
            expect(screen.getByText('最低2文字以上入力してください')).toBeInTheDocument();
        });
    });
    
    test('searches playlists and displays results', async () => {
        mockedAxios.get.mockResolvedValueOnce({data: mockPlaylists});
        
        render(<PlaylistSearch/>);
        const input = screen.getByPlaceholderText('Enter playlist name');
        const searchButton = screen.getByRole('button', {name: 'Search'});
        
        await act(async () => {
            await userEvent.type(input, 'test query');
            fireEvent.click(searchButton);
        });
        
        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledWith('/api/playlists/search?query=test query');
        });
        
        await waitFor(() => {
            expect(screen.getByText('Test Playlist 1')).toBeInTheDocument();
            expect(screen.getByText('Test Playlist 2')).toBeInTheDocument();
        });
        
        const images = screen.getAllByRole('img', {name: 'Playlist'});
        expect(images).toHaveLength(2);
        expect(images[0]).toHaveAttribute('src', 'https://example.com/image1.jpg');
        expect(images[1]).toHaveAttribute('src', 'https://example.com/image2.jpg');
    });
    
    test('handles API error gracefully', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
        
        render(<PlaylistSearch/>);
        const input = screen.getByPlaceholderText('Enter playlist name');
        const searchButton = screen.getByRole('button', {name: 'Search'});
        
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });
        
        await act(async () => {
            await userEvent.type(input, 'error query');
            fireEvent.click(searchButton);
        });
        
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('プレイリスト検索中にエラーが発生しました:', expect.any(Error));
        });
        
        consoleSpy.mockRestore();
        
        await waitFor(() => {
            expect(screen.queryByText('Test Playlist 1')).not.toBeInTheDocument();
            expect(screen.queryByText('Test Playlist 2')).not.toBeInTheDocument();
        });
    });
});
