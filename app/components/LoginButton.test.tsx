import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {axe} from 'jest-axe';
import 'jest-axe/extend-expect'; // これを追加
import LoginButton from './LoginButton';
import {UserContextProvider, useUser} from '../context/UserContext';
import {expect} from '@jest/globals';

// モックの作成
jest.mock('../context/UserContext', () => ({
    ...jest.requireActual('../context/UserContext'),
    useUser: jest.fn(),
}));

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;

// グローバルオブジェクトのモック
const mockReload = jest.fn();
Object.defineProperty(window, 'location', {
    value: {reload: mockReload, href: ''},
    writable: true,
});

// フェッチのモック
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({status: 'success'}), // ここを追加
    } as Response)
);

describe('LoginButton', () => {
    let queryClient: QueryClient;
    
    beforeEach(() => {
        queryClient = new QueryClient();
        jest.clearAllMocks();
    });
    
    it('ログインしていない状態で正しく表示される', () => {
        mockUseUser.mockReturnValue({isLoggedIn: false, userId: null, error: null});
        
        render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider>
                    <LoginButton/>
                </UserContextProvider>
            </QueryClientProvider>
        );
        
        expect(screen.getByText('Spotifyでログイン')).toBeInTheDocument();
    });
    
    it('ログイン状態で正しく表示される', () => {
        mockUseUser.mockReturnValue({isLoggedIn: true, userId: 'test-user-id', error: null});
        
        render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider>
                    <LoginButton/>
                </UserContextProvider>
            </QueryClientProvider>
        );
        
        expect(screen.getByText('ログアウト')).toBeInTheDocument();
    });
    
    it('ログインボタンをクリックするとSpotify認証URLにリダイレクトする', () => {
        mockUseUser.mockReturnValue({isLoggedIn: false, userId: null, error: null});
        process.env.NEXT_PUBLIC_SPOTIFY_AUTH_URL = 'http://test-spotify-auth-url.com';
        
        render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider>
                    <LoginButton/>
                </UserContextProvider>
            </QueryClientProvider>
        );
        
        fireEvent.click(screen.getByText('Spotifyでログイン'));
        
        expect(window.location.href).toBe('http://test-spotify-auth-url.com');
    });
    
    it('ログアウトボタンをクリックするとログアウト処理が実行される', async () => {
        mockUseUser.mockReturnValue({isLoggedIn: true, userId: 'test-user-id', error: null});
        
        render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider>
                    <LoginButton/>
                </UserContextProvider>
            </QueryClientProvider>
        );
        
        fireEvent.click(screen.getByText('ログアウト'));
        
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/logout', {
                method: 'POST',
                credentials: 'include',
            });
            expect(mockReload).toHaveBeenCalled();
        });
    });
    
    it('アクセシビリティ違反がないこと', async () => {
        mockUseUser.mockReturnValue({isLoggedIn: false, userId: null, error: null});
        
        const {container} = render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider>
                    <LoginButton/>
                </UserContextProvider>
            </QueryClientProvider>
        );
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
