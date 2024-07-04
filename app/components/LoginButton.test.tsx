import React from 'react';
import {render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import axios from 'axios';
import {axe, toHaveNoViolations} from 'jest-axe';
import LoginButton from './LoginButton';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

expect.extend(toHaveNoViolations);

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockFetch = jest.fn();
global.fetch = mockFetch;

let queryClient: QueryClient;

const createWrapper = () => {
    queryClient = new QueryClient({
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

describe('LoginButton', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        queryClient?.clear();
        mockFetch.mockClear();
    });
    
    test('アクセシビリティに問題がないこと', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({status: 'error'})
        });
        const {container} = render(<LoginButton onLoginSuccess={jest.fn()}/>, {wrapper: createWrapper()});
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    describe('ログイン状態', () => {
        beforeEach(() => {
            mockFetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({status: 'success'})
            });
        });
        
        test('ログアウトボタンが表示される', async () => {
            const mockOnLoginSuccess = jest.fn();
            await act(async () => {
                render(<LoginButton onLoginSuccess={mockOnLoginSuccess}/>, {wrapper: createWrapper()});
            });
            
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
            
            await act(async () => {
                render(<LoginButton onLoginSuccess={jest.fn()}/>, {wrapper: createWrapper()});
            });
            
            await waitFor(() => {
                expect(screen.getByRole('button', {name: 'ログアウト'})).toBeInTheDocument();
            });
            
            await act(async () => {
                fireEvent.click(screen.getByRole('button', {name: 'ログアウト'}));
            });
            
            await waitFor(() => {
                expect(mockedAxios.post).toHaveBeenCalledWith('/api/logout', {}, {withCredentials: true});
                expect(mockReload).toHaveBeenCalledTimes(1);
            });
        });
    });
    
    describe('未ログイン状態', () => {
        beforeEach(() => {
            mockFetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({status: 'error'})
            });
        });
        
        test('ログインボタンが表示される', async () => {
            await act(async () => {
                render(<LoginButton onLoginSuccess={jest.fn()}/>, {wrapper: createWrapper()});
            });
            
            await waitFor(() => {
                expect(screen.getByRole('button', {name: 'Spotifyでログイン'})).toBeInTheDocument();
            });
        });
        
        test('ログインボタンクリックで正しいURLにリダイレクトされる', async () => {
            const originalLocation = window.location;
            const mockLocation = {
                ...originalLocation,
                href: '',
            };
            Object.defineProperty(window, 'location', {
                writable: true,
                value: mockLocation,
            });
            
            await act(async () => {
                render(<LoginButton onLoginSuccess={jest.fn()}/>, {wrapper: createWrapper()});
            });
            
            await waitFor(() => {
                expect(screen.getByRole('button', {name: 'Spotifyでログイン'})).toBeInTheDocument();
            });
            
            fireEvent.click(screen.getByRole('button', {name: 'Spotifyでログイン'}));
            
            expect(window.location.href).toBe('http://localhost:8080/oauth2/authorization/spotify');
            
            Object.defineProperty(window, 'location', {
                writable: true,
                value: originalLocation,
            });
        });
    });
    
    test('セッションチェックでエラーが発生した場合の処理', async () => {
        const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {
        });
        
        mockFetch.mockRejectedValue(new Error('Network Error'));
        
        await act(async () => {
            render(<LoginButton onLoginSuccess={jest.fn()}/>, {wrapper: createWrapper()});
        });
        
        await waitFor(() => {
            expect(mockConsoleError).toHaveBeenCalledWith('セッションチェックエラー:', expect.any(Error));
            expect(screen.getByRole('button', {name: 'Spotifyでログイン'})).toBeInTheDocument();
        });
        
        mockConsoleError.mockRestore();
    });
    
    test('ローディング中の表示', async () => {
        mockFetch.mockImplementation(() => new Promise(() => {
        })); // 永続的なペンディング状態
        
        render(<LoginButton onLoginSuccess={jest.fn()}/>, {wrapper: createWrapper()});
        
        expect(screen.getByRole('button', {name: '読み込み中...'})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: '読み込み中...'})).toBeDisabled();
    });
});
