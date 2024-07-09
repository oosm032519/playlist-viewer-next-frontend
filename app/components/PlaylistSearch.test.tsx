import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import PlaylistSearch from './PlaylistSearch';
import axios from 'axios';
import {axe, toHaveNoViolations} from 'jest-axe';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

// モックの設定
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const queryClient = new QueryClient();

const renderWithQueryClient = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>
            {ui}
        </QueryClientProvider>
    );
};

describe('PlaylistSearch Component', () => {
    beforeEach(() => {
        queryClient.clear();
    });
    
    it('renders the form and table correctly', () => {
        renderWithQueryClient(<PlaylistSearch/>);
        expect(screen.getByPlaceholderText('Enter playlist name')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /search/i})).toBeInTheDocument();
    });
    
    it('displays validation error when query is empty', async () => {
        renderWithQueryClient(<PlaylistSearch/>);
        fireEvent.click(screen.getByRole('button', {name: /search/i}));
        await waitFor(() => {
            expect(screen.getByText('検索クエリを入力してください')).toBeInTheDocument();
        });
    });
    
    it('displays validation error when query is less than 2 characters', async () => {
        renderWithQueryClient(<PlaylistSearch/>);
        fireEvent.input(screen.getByPlaceholderText('Enter playlist name'), {target: {value: 'a'}});
        fireEvent.click(screen.getByRole('button', {name: /search/i}));
        await waitFor(() => {
            expect(screen.getByText('最低2文字以上入力してください')).toBeInTheDocument();
        });
    });
    
    it('fetches and displays playlists on valid query', async () => {
        const mockPlaylists = [
            {
                id: '1',
                name: 'Playlist 1',
                description: 'Description 1',
                images: [{url: 'http://example.com/image1.jpg'}]
            },
            {
                id: '2',
                name: 'Playlist 2',
                description: 'Description 2',
                images: [{url: 'http://example.com/image2.jpg'}]
            },
        ];
        mockedAxios.get.mockResolvedValueOnce({data: mockPlaylists});
        
        renderWithQueryClient(<PlaylistSearch/>);
        fireEvent.input(screen.getByPlaceholderText('Enter playlist name'), {target: {value: 'test'}});
        fireEvent.click(screen.getByRole('button', {name: /search/i}));
        
        await waitFor(() => {
            expect(screen.getByText('Playlist 1')).toBeInTheDocument();
            expect(screen.getByText('Playlist 2')).toBeInTheDocument();
            expect(screen.getAllByRole('img')).toHaveLength(2);
        });
    });
    
    it('should have no accessibility violations', async () => {
        const {container} = renderWithQueryClient(<PlaylistSearch/>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
