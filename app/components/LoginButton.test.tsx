// app/components/LoginButton.test.tsx

import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {axe} from 'jest-axe';
import 'jest-axe/extend-expect'; // アクセシビリティテストのためのjest-axeの拡張
import LoginButton from './LoginButton';
import {UserContextProvider, useUser} from '../context/UserContext';
import {expect} from '@jest/globals';

// UserContextのモックを作成
jest.mock('../context/UserContext', () => ({
    ...jest.requireActual('../context/UserContext'),
    useUser: jest.fn(),
}));

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;

// window.locationオブジェクトのモック
const mockReload = jest.fn();
Object.defineProperty(window, 'location', {
    value: {reload: mockReload, href: ''},
    writable: true,
});

// fetch APIのモック
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({status: 'success'}), // モックのレスポンスを設定
    } as Response)
);

describe('LoginButton', () => {
    let queryClient: QueryClient;
    
    beforeEach(() => {
        queryClient = new QueryClient();
        jest.clearAllMocks(); // 各テスト前にモックをクリア
    });
    
    it('ログインしていない状態で正しく表示される', () => {
        // ログインしていない状態のモックを設定
        mockUseUser.mockReturnValue({isLoggedIn: false, userId: null, error: null});
        
        render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider>
                    <LoginButton/>
                </UserContextProvider>
            </QueryClientProvider>
        );
        
        // ログインボタンが表示されていることを確認
        expect(screen.getByText('Spotifyでログイン')).toBeInTheDocument();
    });
    
    it('ログイン状態で正しく表示される', () => {
        // ログイン状態のモックを設定
        mockUseUser.mockReturnValue({isLoggedIn: true, userId: 'test-user-id', error: null});
        
        render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider>
                    <LoginButton/>
                </UserContextProvider>
            </QueryClientProvider>
        );
        
        // ログアウトボタンが表示されていることを確認
        expect(screen.getByText('ログアウト')).toBeInTheDocument();
    });
    
    it('ログインボタンをクリックするとSpotify認証URLにリダイレクトする', () => {
        // ログインしていない状態のモックを設定
        mockUseUser.mockReturnValue({isLoggedIn: false, userId: null, error: null});
        process.env.NEXT_PUBLIC_SPOTIFY_AUTH_URL = 'http://test-spotify-auth-url.com';
        
        render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider>
                    <LoginButton/>
                </UserContextProvider>
            </QueryClientProvider>
        );
        
        // ログインボタンをクリック
        fireEvent.click(screen.getByText('Spotifyでログイン'));
        
        // URLが正しく設定されていることを確認
        expect(window.location.href).toBe('http://test-spotify-auth-url.com');
    });
    
    it('ログアウトボタンをクリックするとログアウト処理が実行される', async () => {
        // ログイン状態のモックを設定
        mockUseUser.mockReturnValue({isLoggedIn: true, userId: 'test-user-id', error: null});
        
        render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider>
                    <LoginButton/>
                </UserContextProvider>
            </QueryClientProvider>
        );
        
        // ログアウトボタンをクリック
        fireEvent.click(screen.getByText('ログアウト'));
        
        // ログアウト処理が実行されることを確認
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/logout', {
                method: 'POST',
                credentials: 'include',
            });
            expect(mockReload).toHaveBeenCalled();
        });
    });
    
    it('アクセシビリティ違反がないこと', async () => {
        // ログインしていない状態のモックを設定
        mockUseUser.mockReturnValue({isLoggedIn: false, userId: null, error: null});
        
        const {container} = render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider>
                    <LoginButton/>
                </UserContextProvider>
            </QueryClientProvider>
        );
        
        // アクセシビリティテストを実行
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
