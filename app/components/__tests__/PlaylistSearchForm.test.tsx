// PlaylistSearchForm.test.tsx

import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import axios from 'axios';
import PlaylistSearchForm from '../PlaylistSearchForm';
import '@testing-library/jest-dom';

// axiosのモック化
jest.mock('axios');

// テスト用のダミーデータ
const mockPlaylists = [
    {id: '1', name: 'Playlist 1'},
    {id: '2', name: 'Playlist 2'},
];

describe('PlaylistSearchForm', () => {
    // 各テストの前にモックをリセット
    beforeEach(() => {
        jest.resetAllMocks();
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
        (axios.get as jest.Mock).mockResolvedValueOnce({data: mockPlaylists});
        
        render(<PlaylistSearchForm onSearch={onSearchMock}/>);
        
        const input = screen.getByPlaceholderText('Enter playlist name');
        const button = screen.getByRole('button', {name: 'Search'});
        
        fireEvent.change(input, {target: {value: 'test query'}});
        fireEvent.click(button);
        
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith('/api/playlists/search?query=test query');
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
        (axios.get as jest.Mock).mockImplementation(() => new Promise(() => {
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
});
