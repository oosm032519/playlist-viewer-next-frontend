// src/app/components/__tests__/LoginButton.test.tsx

import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import axios from 'axios';
import LoginButton from '../LoginButton';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LoginButton', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    test('ログイン状態でログアウトボタンが表示される', async () => {
        mockedAxios.get.mockResolvedValue({data: {status: 'success'}});
        
        const mockOnLoginSuccess = jest.fn();
        render(<LoginButton onLoginSuccess={mockOnLoginSuccess}/>);
        
        await waitFor(() => {
            expect(screen.getByText('ログアウト')).toBeInTheDocument();
        });
        
        expect(mockOnLoginSuccess).toHaveBeenCalled();
    });
    
    test('未ログイン状態でログインボタンが表示される', async () => {
        mockedAxios.get.mockRejectedValue(new Error('Unauthorized'));
        
        // コンソールエラーを抑制
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });
        
        render(<LoginButton onLoginSuccess={jest.fn()}/>);
        
        await waitFor(() => {
            expect(screen.getByText('Spotifyでログイン')).toBeInTheDocument();
        });
        
        // エラーがログされたことを確認
        expect(consoleSpy).toHaveBeenCalledWith('セッションチェックエラー:', expect.any(Error));
        
        // スパイをリストア
        consoleSpy.mockRestore();
    });
    
    test('ログインボタンクリックで正しいURLにリダイレクトされる', () => {
        // window.location.hrefをモック
        const originalLocation = window.location;
        const mockLocation = {
            ...originalLocation,
            href: '',
        };
        Object.defineProperty(window, 'location', {
            writable: true,
            value: mockLocation,
        });
        
        render(<LoginButton onLoginSuccess={jest.fn()}/>);
        
        fireEvent.click(screen.getByText('Spotifyでログイン'));
        
        expect(window.location.href).toBe('http://localhost:8080/oauth2/authorization/spotify');
        
        // window.locationを元に戻す
        Object.defineProperty(window, 'location', {
            writable: true,
            value: originalLocation,
        });
    });
    
    test('ログアウトボタンクリックで正しい処理が行われる', async () => {
        mockedAxios.get.mockResolvedValue({data: {status: 'success'}});
        mockedAxios.post.mockResolvedValue({});
        
        const mockReload = jest.fn();
        Object.defineProperty(window, 'location', {
            value: {reload: mockReload},
            writable: true
        });
        
        render(<LoginButton onLoginSuccess={jest.fn()}/>);
        
        await waitFor(() => {
            expect(screen.getByText('ログアウト')).toBeInTheDocument();
        });
        
        fireEvent.click(screen.getByText('ログアウト'));
        
        expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:8080/logout', {withCredentials: true});
        
        await waitFor(() => {
            expect(mockReload).toHaveBeenCalled();
        });
    });
    
    test('セッションチェックでエラーが発生した場合の処理', async () => {
        const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {
        });
        
        mockedAxios.get.mockRejectedValue(new Error('Network Error'));
        
        render(<LoginButton onLoginSuccess={jest.fn()}/>);
        
        await waitFor(() => {
            expect(mockConsoleError).toHaveBeenCalledWith('セッションチェックエラー:', expect.any(Error));
        });
        
        expect(screen.getByText('Spotifyでログイン')).toBeInTheDocument();
        
        mockConsoleError.mockRestore();
    });
});
