// app/components/PlaylistSearch.test.tsx

import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {QueryClient, QueryClientProvider, useQuery} from '@tanstack/react-query';
import {axe, toHaveNoViolations} from 'jest-axe';
import PlaylistSearch from './PlaylistSearch';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

jest.mock('@tanstack/react-query', () => ({
    ...jest.requireActual('@tanstack/react-query'),
    useQuery: jest.fn(),
}));

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

describe('PlaylistSearch', () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseQuery.mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
            refetch: jest.fn(),
        } as any);
    });
    
    const renderComponent = () => {
        return render(
            <QueryClientProvider client={queryClient}>
                <PlaylistSearch/>
            </QueryClientProvider>
        );
    };
    
    it('should render without crashing', () => {
        renderComponent();
        expect(screen.getByText('Playlist Search')).toBeInTheDocument();
    });
    
    it('should show validation error for short query', async () => {
        renderComponent();
        
        const input = screen.getByRole('textbox', {name: /enter playlist name/i});
        const searchButton = screen.getByRole('button', {name: /search/i});
        
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
            error: null,
            refetch: mockRefetch,
        } as any);
        
        renderComponent();
        
        const input = screen.getByRole('textbox', {name: /enter playlist name/i});
        const searchButton = screen.getByRole('button', {name: /search/i});
        
        await userEvent.type(input, 'valid query');
        await userEvent.click(searchButton);
        
        await waitFor(() => {
            expect(mockRefetch).toHaveBeenCalled();
        });
    });
    
    it('should display loading state during search', () => {
        mockUseQuery.mockReturnValue({
            data: [],
            isLoading: true,
            error: null,
            refetch: jest.fn(),
        } as any);
        
        renderComponent();
        expect(screen.getByText('Searching...')).toBeInTheDocument();
    });
    
    it('should render playlist results', async () => {
        const mockPlaylists = [
            {
                id: '1',
                name: 'Playlist 1',
                images: [{url: 'image1.jpg', height: 300, width: 300}]
            },
            {
                id: '2',
                name: 'Playlist 2',
                images: [{url: 'image2.jpg', height: 300, width: 300}]
            },
        ];
        
        mockUseQuery.mockReturnValue({
            data: mockPlaylists,
            isLoading: false,
            error: null,
            refetch: jest.fn(),
        } as any);
        
        renderComponent();
        
        // テーブルヘッダーの検証
        expect(screen.getByText('Image')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        
        // プレイリスト名の検証
        await waitFor(() => {
            expect(screen.getByText('Playlist 1')).toBeInTheDocument();
            expect(screen.getByText('Playlist 2')).toBeInTheDocument();
        });
        
        // テーブル構造の検証
        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(3); // ヘッダー行 + 2つのデータ行
    });
    
    it('should be accessible', async () => {
        const {container} = renderComponent();
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
