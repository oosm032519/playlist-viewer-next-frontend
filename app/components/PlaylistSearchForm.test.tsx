// PlaylistSearchForm.test.tsx

import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {axe, toHaveNoViolations} from 'jest-axe';
import axios from 'axios';
import * as renderer from 'react-test-renderer';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import PlaylistSearchForm from './PlaylistSearchForm';
import '@testing-library/jest-dom';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

jest.mock('axios');

const mockPlaylists = [
    {id: '1', name: 'Playlist 1'},
    {id: '2', name: 'Playlist 2'},
];

const mockAxios = axios as jest.Mocked<typeof axios>;

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return ({children}: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('PlaylistSearchForm', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        mockAxios.get.mockClear();
    });
    
    test('renders search input and button', () => {
        render(<PlaylistSearchForm onSearch={() => {
        }}/>, {wrapper: createWrapper()});
        expect(screen.getByPlaceholderText('Enter playlist name')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Search'})).toBeInTheDocument();
    });
    
    test('submits form with valid input', async () => {
        const onSearchMock = jest.fn();
        mockAxios.get.mockResolvedValueOnce({data: mockPlaylists});
        render(<PlaylistSearchForm onSearch={onSearchMock}/>, {wrapper: createWrapper()});
        const input = screen.getByPlaceholderText('Enter playlist name');
        const button = screen.getByRole('button', {name: 'Search'});
        fireEvent.change(input, {target: {value: 'test query'}});
        fireEvent.click(button);
        await waitFor(() => {
            expect(mockAxios.get).toHaveBeenCalledWith('/api/playlists/search?query=test query');
            expect(onSearchMock).toHaveBeenCalledWith(mockPlaylists);
        });
    });
    
    test('displays validation error for short input', async () => {
        render(<PlaylistSearchForm onSearch={() => {
        }}/>, {wrapper: createWrapper()});
        const input = screen.getByPlaceholderText('Enter playlist name');
        const button = screen.getByRole('button', {name: 'Search'});
        fireEvent.change(input, {target: {value: 'a'}});
        fireEvent.click(button);
        await waitFor(() => {
            expect(screen.getByText('最低2文字以上入力してください')).toBeInTheDocument();
        });
    });
    
    test('displays loading state during search', async () => {
        mockAxios.get.mockImplementation(() => new Promise(() => {
        }));
        render(<PlaylistSearchForm onSearch={() => {
        }}/>, {wrapper: createWrapper()});
        const input = screen.getByPlaceholderText('Enter playlist name');
        const button = screen.getByRole('button', {name: 'Search'});
        fireEvent.change(input, {target: {value: 'test query'}});
        fireEvent.click(button);
        await waitFor(() => {
            expect(button).toHaveTextContent('Searching...');
            expect(button).toBeDisabled();
            expect(input).toBeDisabled();
        });
    });
    
    test('should not have any accessibility violations', async () => {
        const {container} = render(<PlaylistSearchForm onSearch={() => {
        }}/>, {wrapper: createWrapper()});
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    test('handles API error correctly', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });
        const onSearchMock = jest.fn();
        mockAxios.get.mockRejectedValueOnce(new Error('API Error'));
        render(<PlaylistSearchForm onSearch={onSearchMock}/>, {wrapper: createWrapper()});
        const input = screen.getByPlaceholderText('Enter playlist name');
        const button = screen.getByRole('button', {name: 'Search'});
        fireEvent.change(input, {target: {value: 'test query'}});
        fireEvent.click(button);
        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith('プレイリスト検索中にエラーが発生しました:', expect.any(Error));
            expect(onSearchMock).not.toHaveBeenCalled();
            expect(button).toHaveTextContent('Search');
            expect(button).not.toBeDisabled();
            expect(input).not.toBeDisabled();
        });
        consoleErrorSpy.mockRestore();
    });
    
    test('allows submission with minimum valid input length', async () => {
        const onSearchMock = jest.fn();
        mockAxios.get.mockResolvedValueOnce({data: mockPlaylists});
        render(<PlaylistSearchForm onSearch={onSearchMock}/>, {wrapper: createWrapper()});
        const input = screen.getByPlaceholderText('Enter playlist name');
        const button = screen.getByRole('button', {name: 'Search'});
        fireEvent.change(input, {target: {value: 'ab'}});
        fireEvent.click(button);
        await waitFor(() => {
            expect(mockAxios.get).toHaveBeenCalledWith('/api/playlists/search?query=ab');
            expect(onSearchMock).toHaveBeenCalledWith(mockPlaylists);
        });
    });
    
    test('matches snapshot', () => {
        const tree = renderer.create(
            <QueryClientProvider client={new QueryClient()}>
                <PlaylistSearchForm onSearch={() => {
                }}/>
            </QueryClientProvider>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
    
    test('handles network error correctly', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });
        const onSearchMock = jest.fn();
        mockAxios.get.mockRejectedValueOnce(new Error('Network Error'));
        render(<PlaylistSearchForm onSearch={onSearchMock}/>, {wrapper: createWrapper()});
        const input = screen.getByPlaceholderText('Enter playlist name');
        const button = screen.getByRole('button', {name: 'Search'});
        fireEvent.change(input, {target: {value: 'test query'}});
        fireEvent.click(button);
        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith('プレイリスト検索中にエラーが発生しました:', expect.any(Error));
            expect(onSearchMock).not.toHaveBeenCalled();
        });
        consoleErrorSpy.mockRestore();
    });
    
    test('does not reset form after successful search', async () => {
        const onSearchMock = jest.fn();
        mockAxios.get.mockResolvedValueOnce({data: mockPlaylists});
        render(<PlaylistSearchForm onSearch={onSearchMock}/>, {wrapper: createWrapper()});
        const input = screen.getByPlaceholderText('Enter playlist name');
        const button = screen.getByRole('button', {name: 'Search'});
        fireEvent.change(input, {target: {value: 'test query'}});
        fireEvent.click(button);
        await waitFor(() => {
            expect(onSearchMock).toHaveBeenCalledWith(mockPlaylists);
            expect(input).toHaveValue('test query');
        });
    });
    
    test('allows consecutive searches', async () => {
        const onSearchMock = jest.fn();
        mockAxios.get
            .mockResolvedValueOnce({data: mockPlaylists})
            .mockResolvedValueOnce({data: [{id: '3', name: 'Playlist 3'}]});
        render(<PlaylistSearchForm onSearch={onSearchMock}/>, {wrapper: createWrapper()});
        const input = screen.getByPlaceholderText('Enter playlist name');
        const button = screen.getByRole('button', {name: 'Search'});
        
        // First search
        fireEvent.change(input, {target: {value: 'test query 1'}});
        fireEvent.click(button);
        await waitFor(() => {
            expect(onSearchMock).toHaveBeenCalledWith(mockPlaylists);
        });
        
        // Second search
        fireEvent.change(input, {target: {value: 'test query 2'}});
        fireEvent.click(button);
        await waitFor(() => {
            expect(onSearchMock).toHaveBeenCalledWith([{id: '3', name: 'Playlist 3'}]);
        });
        
        expect(onSearchMock).toHaveBeenCalledTimes(2);
    });
});
