import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {QueryClient, QueryClientProvider, useQuery} from '@tanstack/react-query';
import {axe, toHaveNoViolations} from 'jest-axe';
import PlaylistSearch from './PlaylistSearch';
import {expect} from '@jest/globals';

// jest-axeのカスタムマッチャーを追加
expect.extend(toHaveNoViolations);

// モックの設定
jest.mock('@tanstack/react-query', () => ({
    ...jest.requireActual('@tanstack/react-query'),
    useQuery: jest.fn(),
}));

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

describe('PlaylistSearch', () => {
    const queryClient = new QueryClient();
    
    beforeEach(() => {
        mockUseQuery.mockReturnValue({
            data: [],
            isLoading: false,
            refetch: jest.fn(),
        } as any);
    });
    
    it('should render without crashing', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistSearch/>
            </QueryClientProvider>
        );
        expect(screen.getByText('Playlist Search')).toBeInTheDocument();
    });
    
    it('should show validation error for short query', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistSearch/>
            </QueryClientProvider>
        );
        
        const input = screen.getByLabelText('Enter playlist name');
        const searchButton = screen.getByRole('button', {name: 'Search'});
        
        await userEvent.type(input, 'a');
        await userEvent.click(searchButton);
        
        await waitFor(() => {
            expect(screen.getByText('最低2文字以上入力してください')).toBeInTheDocument();
        });
    });
    
    it('should trigger search on valid input', async () => {
        const mockRefetch = jest.fn();
        mockUseQuery.mockReturnValue({
            data: [],
            isLoading: false,
            refetch: mockRefetch,
        } as any);
        
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistSearch/>
            </QueryClientProvider>
        );
        
        const input = screen.getByLabelText('Enter playlist name');
        const searchButton = screen.getByRole('button', {name: 'Search'});
        
        await userEvent.type(input, 'valid query');
        await userEvent.click(searchButton);
        
        await waitFor(() => {
            expect(mockRefetch).toHaveBeenCalled();
        });
    });
    
    it('should display loading state during search', async () => {
        mockUseQuery.mockReturnValue({
            data: [],
            isLoading: true,
            refetch: jest.fn(),
        } as any);
        
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistSearch/>
            </QueryClientProvider>
        );
        
        expect(screen.getByText('Searching...')).toBeInTheDocument();
    });
    
    it('should render playlist results', async () => {
        const mockPlaylists = [
            {id: '1', name: 'Playlist 1', images: [{url: 'image1.jpg'}]},
            {id: '2', name: 'Playlist 2', images: [{url: 'image2.jpg'}]},
        ];
        
        mockUseQuery.mockReturnValue({
            data: mockPlaylists,
            isLoading: false,
            refetch: jest.fn(),
        } as any);
        
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistSearch/>
            </QueryClientProvider>
        );
        
        await waitFor(() => {
            expect(screen.getByText('Playlist 1')).toBeInTheDocument();
            expect(screen.getByText('Playlist 2')).toBeInTheDocument();
            expect(screen.getAllByRole('img', {name: 'Playlist'})).toHaveLength(2);
        });
    });
    
    it('should be accessible', async () => {
        const {container} = render(
            <QueryClientProvider client={queryClient}>
                <PlaylistSearch/>
            </QueryClientProvider>
        );
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
