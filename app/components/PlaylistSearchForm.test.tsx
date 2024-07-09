import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import PlaylistSearchForm from '../components/PlaylistSearchForm';
import {useSearchPlaylists} from '../hooks/useSearchPlaylists';
import {axe, toHaveNoViolations} from 'jest-axe';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

jest.mock('../hooks/useSearchPlaylists');

const mockUseSearchPlaylists = useSearchPlaylists as jest.Mock;

const queryClient = new QueryClient();

const renderWithQueryClient = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>
            {ui}
        </QueryClientProvider>
    );
};

describe('PlaylistSearchForm', () => {
    const mockOnSearch = jest.fn();
    
    beforeEach(() => {
        mockUseSearchPlaylists.mockReturnValue({
            mutate: jest.fn(),
            isPending: false,
        });
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    test('renders the form and submit button', () => {
        renderWithQueryClient(<PlaylistSearchForm onSearch={mockOnSearch}/>);
        
        expect(screen.getByPlaceholderText('Enter playlist name')).toBeInTheDocument();
        expect(screen.getByText('Search')).toBeInTheDocument();
    });
    
    test('calls search mutation on form submit', async () => {
        const mockMutate = jest.fn();
        mockUseSearchPlaylists.mockReturnValue({
            mutate: mockMutate,
            isPending: false,
        });
        
        renderWithQueryClient(<PlaylistSearchForm onSearch={mockOnSearch}/>);
        
        fireEvent.change(screen.getByPlaceholderText('Enter playlist name'), {target: {value: 'test playlist'}});
        fireEvent.click(screen.getByText('Search'));
        
        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith({query: 'test playlist', page: 1, limit: 20});
        });
    });
    
    test('displays loading spinner when search is pending', () => {
        mockUseSearchPlaylists.mockReturnValue({
            mutate: jest.fn(),
            isPending: true,
        });
        
        renderWithQueryClient(<PlaylistSearchForm onSearch={mockOnSearch}/>);
        
        expect(screen.getByText('Searching...')).toBeInTheDocument();
    });
    
    test('is accessible', async () => {
        const {container} = renderWithQueryClient(<PlaylistSearchForm onSearch={mockOnSearch}/>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
