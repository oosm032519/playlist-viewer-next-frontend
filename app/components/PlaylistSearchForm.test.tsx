// PlaylistSearchForm.test.tsx

import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {axe, toHaveNoViolations} from 'jest-axe';
import axios from 'axios';
import * as renderer from 'react-test-renderer';import PlaylistSearchForm from './PlaylistSearchForm';
import '@testing-library/jest-dom';

expect.extend(toHaveNoViolations);

// axiosのモック化
jest.mock('axios');

// テスト用のダミーデータ
const mockPlaylists = [
    {id: '1', name: 'Playlist 1'},
    {id: '2', name: 'Playlist 2'},
];

// axiosのモックをより詳細に設定
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('PlaylistSearchForm', () => {
    // 各テストの前にモックをリセット
    beforeEach(() => {
        jest.resetAllMocks();
        mockAxios.get.mockClear();
    });
    
    // 基本的なレンダリングテスト
    test('renders search input and button', () => {
        render(<PlaylistSearchForm onSearch={() => {
        }}/>);
        
        expect(screen.getByPlaceholderText('Enter playlist name')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Search'})).toBeInTheDocument();
    });
    
    // フォーム送信のテスト
    test('submits form with valid input', async () => {
        const onSearchMock = jest.fn();
        mockAxios.get.mockResolvedValueOnce({data: mockPlaylists});
        
        render(<PlaylistSearchForm onSearch={onSearchMock}/>);
        
        const input = screen.getByPlaceholderText('Enter playlist name');
        const button = screen.getByRole('button', {name: 'Search'});
        
        fireEvent.change(input, {target: {value: 'test query'}});
        fireEvent.click(button);
        
        await waitFor(() => {
            expect(mockAxios.get).toHaveBeenCalledWith('/api/playlists/search?query=test query');
            expect(onSearchMock).toHaveBeenCalledWith(mockPlaylists);
        });
    });
    
    // バリデーションエラーのテスト
    test('displays validation error for short input', async () => {
        render(<PlaylistSearchForm onSearch={() => {
        }}/>);
        
        const input = screen.getByPlaceholderText('Enter playlist name');
        const button = screen.getByRole('button', {name: 'Search'});
        
        fireEvent.change(input, {target: {value: 'a'}});
        fireEvent.click(button);
        
        await waitFor(() => {
            expect(screen.getByText('最低2文字以上入力してください')).toBeInTheDocument();
        });
    });
    
    // ローディング状態のテスト
    test('displays loading state during search', async () => {
        mockAxios.get.mockImplementation(() => new Promise(() => {
        })); // 永続的な保留状態を模倣
        
        render(<PlaylistSearchForm onSearch={() => {
        }}/>);
        
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
    
    // アクセシビリティテスト
    test('should not have any accessibility violations', async () => {
        const {container} = render(<PlaylistSearchForm onSearch={() => {
        }}/>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    // エラーハンドリングのテスト
    test('handles API error correctly', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });
        const onSearchMock = jest.fn();
        mockAxios.get.mockRejectedValueOnce(new Error('API Error'));
        
        render(<PlaylistSearchForm onSearch={onSearchMock}/>);
        
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
    
    // 境界値テスト
    test('allows submission with minimum valid input length', async () => {
        const onSearchMock = jest.fn();
        mockAxios.get.mockResolvedValueOnce({data: mockPlaylists});
        
        render(<PlaylistSearchForm onSearch={onSearchMock}/>);
        
        const input = screen.getByPlaceholderText('Enter playlist name');
        const button = screen.getByRole('button', {name: 'Search'});
        
        fireEvent.change(input, {target: {value: 'ab'}});
        fireEvent.click(button);
        
        await waitFor(() => {
            expect(mockAxios.get).toHaveBeenCalledWith('/api/playlists/search?query=ab');
            expect(onSearchMock).toHaveBeenCalledWith(mockPlaylists);
        });
    });
    
    // スナップショットテスト
    test('matches snapshot', () => {
        const tree = renderer.create(<PlaylistSearchForm onSearch={() => {
        }}/>).toJSON();
        expect(tree).toMatchSnapshot();
    });
    
    // ネットワークエラーのテスト
    test('handles network error correctly', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });
        const onSearchMock = jest.fn();
        mockAxios.get.mockRejectedValueOnce(new Error('Network Error'));
        
        render(<PlaylistSearchForm onSearch={onSearchMock}/>);
        
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
    
    // フォームリセットのテスト
    test('does not reset form after successful search', async () => {
        const onSearchMock = jest.fn();
        mockAxios.get.mockResolvedValueOnce({data: mockPlaylists});
        
        render(<PlaylistSearchForm onSearch={onSearchMock}/>);
        
        const input = screen.getByPlaceholderText('Enter playlist name');
        const button = screen.getByRole('button', {name: 'Search'});
        
        fireEvent.change(input, {target: {value: 'test query'}});
        fireEvent.click(button);
        
        await waitFor(() => {
            expect(onSearchMock).toHaveBeenCalledWith(mockPlaylists);
            expect(input).toHaveValue('test query');
        });
    });
    
    // 連続検索のテスト
    test('allows consecutive searches', async () => {
        const onSearchMock = jest.fn();
        mockAxios.get
            .mockResolvedValueOnce({data: mockPlaylists})
            .mockResolvedValueOnce({data: [{id: '3', name: 'Playlist 3'}]});
        
        render(<PlaylistSearchForm onSearch={onSearchMock}/>);
        
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
