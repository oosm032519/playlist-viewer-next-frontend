import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import axios from 'axios';
import {axe, toHaveNoViolations} from 'jest-axe';
import LoginButton from './LoginButton';

expect.extend(toHaveNoViolations);

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// fetchのモック
global.fetch = jest.fn() as jest.Mock;

describe('LoginButton', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    test('アクセシビリティに問題がないこと', async () => {
        const {container} = render(<LoginButton onLoginSuccess={jest.fn()}/>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    describe('ログイン状態', () => {
        beforeEach(() => {
            (global.fetch as jest.Mock).mockResolvedValue({
                json: () => Promise.resolve({status: 'success'})
            });
        });
        
        test('ログアウトボタンが表示される', async () => {
            const mockOnLoginSuccess = jest.fn();
            render(<LoginButton onLoginSuccess={mockOnLoginSuccess}/>);
            
            await waitFor(() => {
                expect(screen.getByRole('button', {name: 'ログアウト'})).toBeInTheDocument();
            });
            
            expect(mockOnLoginSuccess).toHaveBeenCalledTimes(1);
        });
        
        test('ログアウトボタンクリックで正しい処理が行われる', async () => {
            mockedAxios.post.mockResolvedValue({});
            
            const mockReload = jest.fn();
            Object.defineProperty(window, 'location', {
                value: {reload: mockReload},
                writable: true
            });
            
            render(<LoginButton onLoginSuccess={jest.fn()}/>);
            
            await waitFor(() => {
                expect(screen.getByRole('button', {name: 'ログアウト'})).toBeInTheDocument();
            });
            
            fireEvent.click(screen.getByRole('button', {name: 'ログアウト'}));
            
            expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:8080/logout', {}, {withCredentials: true});
            
            await waitFor(() => {
                expect(mockReload).toHaveBeenCalledTimes(1);
            });
        });
    });
    
    describe('未ログイン状態', () => {
        beforeEach(() => {
            (global.fetch as jest.Mock).mockResolvedValue({
                json: () => Promise.resolve({status: 'error'})
            });
        });
        
        test('ログインボタンが表示される', async () => {
            render(<LoginButton onLoginSuccess={jest.fn()}/>);
            
            await waitFor(() => {
                expect(screen.getByRole('button', {name: 'Spotifyでログイン'})).toBeInTheDocument();
            });
        });
        
        test('ログインボタンクリックで正しいURLにリダイレクトされる', () => {
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
            
            fireEvent.click(screen.getByRole('button', {name: 'Spotifyでログイン'}));
            
            expect(window.location.href).toBe('http://localhost:8080/oauth2/authorization/spotify');
            
            Object.defineProperty(window, 'location', {
                writable: true,
                value: originalLocation,
            });
        });
    });
    
    // エラー処理のテスト
    test('セッションチェックでエラーが発生した場合の処理', async () => {
        const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {
        });
        
        (global.fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));
        
        render(<LoginButton onLoginSuccess={jest.fn()}/>);
        
        await waitFor(() => {
            expect(mockConsoleError).toHaveBeenCalledWith('セッションチェックエラー:', expect.any(Error));
        });
        
        expect(screen.getByRole('button', {name: 'Spotifyでログイン'})).toBeInTheDocument();
        
        mockConsoleError.mockRestore();
    });
});
