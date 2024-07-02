import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import {axe} from 'jest-axe';
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
    
    test('renders PlaylistSearch component correctly', () => {
        render(<PlaylistSearch/>);
        
        expect(screen.getByRole('heading', {name: /playlist search/i})).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/enter playlist name/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /search/i})).toBeInTheDocument();
    });
    
    test('displays error message for invalid input', async () => {
        render(<PlaylistSearch/>);
        const input = screen.getByPlaceholderText(/enter playlist name/i);
        const searchButton = screen.getByRole('button', {name: /search/i});
        
        await userEvent.type(input, 'a');
        await userEvent.click(searchButton);
        expect(await screen.findByText('最低2文字以上入力してください')).toBeInTheDocument();
        
        await userEvent.clear(input);
        await userEvent.click(searchButton);
        expect(await screen.findByText('検索クエリを入力してください')).toBeInTheDocument();
    });
    
    test('searches playlists and displays results correctly', async () => {
        mockedAxios.get.mockResolvedValueOnce({data: mockPlaylists});
        
        render(<PlaylistSearch/>);
        const input = screen.getByPlaceholderText(/enter playlist name/i);
        const searchButton = screen.getByRole('button', {name: /search/i});
        
        await userEvent.type(input, 'test query');
        await userEvent.click(searchButton);
        
        expect(mockedAxios.get).toHaveBeenCalledWith('/api/playlists/search?query=test query');
        
        await waitFor(() => {
            expect(screen.getByText('Test Playlist 1')).toBeInTheDocument();
            expect(screen.getByText('Test Playlist 2')).toBeInTheDocument();
        });
        
        const images = screen.getAllByRole('img', {name: /playlist/i});
        expect(images).toHaveLength(2);
        expect(images[0]).toHaveAttribute('src', 'https://example.com/image1.jpg');
        expect(images[1]).toHaveAttribute('src', 'https://example.com/image2.jpg');
        
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getAllByRole('row')).toHaveLength(3);
    });
    
    test('handles API error gracefully', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });
        mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
        
        render(<PlaylistSearch/>);
        const input = screen.getByPlaceholderText(/enter playlist name/i);
        const searchButton = screen.getByRole('button', {name: /search/i});
        
        await userEvent.type(input, 'error query');
        await userEvent.click(searchButton);
        
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('プレイリスト検索中にエラーが発生しました:', expect.any(Error));
        });
        
        expect(screen.queryByText('Test Playlist 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Test Playlist 2')).not.toBeInTheDocument();
        
        consoleSpy.mockRestore();
    });
    
    test('has no accessibility violations', async () => {
        const {container} = render(<PlaylistSearch/>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    test('displays loading state during search', async () => {
        mockedAxios.get.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({data: mockPlaylists}), 1000)));
        
        render(<PlaylistSearch/>);
        const input = screen.getByPlaceholderText(/enter playlist name/i);
        const searchButton = screen.getByRole('button', {name: /search/i});
        
        await userEvent.type(input, 'test query');
        await userEvent.click(searchButton);
        
        expect(searchButton).toBeDisabled();
        expect(searchButton).toHaveTextContent('Searching...');
        
        await waitFor(() => {
            expect(screen.getByText('Test Playlist 1')).toBeInTheDocument();
        }, {timeout: 2000});
        
        expect(searchButton).not.toBeDisabled();
        expect(searchButton).toHaveTextContent('Search');
    });
});
