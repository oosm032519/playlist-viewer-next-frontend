// app/components/LoginButton.test.tsx

import React from 'react';
import {render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {axe} from 'jest-axe';
import 'jest-axe/extend-expect';
import LoginButton from '@/app/components/LoginButton';
import {UserContextProvider, useUser} from '@/app/context/UserContext';
import {expect} from '@jest/globals';

jest.mock('../context/UserContext', () => ({
    ...jest.requireActual('../context/UserContext'),
    useUser: jest.fn(),
}));

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;

const mockReload = jest.fn();
Object.defineProperty(window, 'location', {
    value: {reload: mockReload, href: ''},
    writable: true,
});

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({status: 'success'}),
    } as Response)
);

describe('LoginButton', () => {
    let queryClient: QueryClient;
    
    beforeEach(() => {
        queryClient = new QueryClient();
        jest.clearAllMocks();
        process.env.NEXT_PUBLIC_BACKEND_URL = 'http://test-backend-url.com';
    });
    
    it('ログインしていない状態で正しく表示される', async () => {
        mockUseUser.mockReturnValue({
            isLoggedIn: false,
            userId: null,
            error: null,
            setIsLoggedIn: jest.fn(),
            setUserId: jest.fn()
        });
        
        await act(async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <UserContextProvider>
                        <LoginButton/>
                    </UserContextProvider>
                </QueryClientProvider>
            );
        });
        
        expect(screen.getByText('Spotifyでログイン')).toBeInTheDocument();
    });
    
    it('ログイン状態で正しく表示される', async () => {
        mockUseUser.mockReturnValue({
            isLoggedIn: true,
            userId: 'test-user-id',
            error: null,
            setIsLoggedIn: jest.fn(),
            setUserId: jest.fn()
        });
        
        await act(async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <UserContextProvider>
                        <LoginButton/>
                    </UserContextProvider>
                </QueryClientProvider>
            );
        });
        
        expect(screen.getByText('ログアウト')).toBeInTheDocument();
    });
    
    it('ログインボタンをクリックするとSpotify認証URLにリダイレクトする', async () => {
        mockUseUser.mockReturnValue({
            isLoggedIn: false,
            userId: null,
            error: null,
            setIsLoggedIn: jest.fn(),
            setUserId: jest.fn()
        });
        
        await act(async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <UserContextProvider>
                        <LoginButton/>
                    </UserContextProvider>
                </QueryClientProvider>
            );
        });
        
        fireEvent.click(screen.getByText('Spotifyでログイン'));
        
        expect(window.location.href).toBe('http://test-backend-url.com/oauth2/authorization/spotify');
    });
    
    it('ログアウトボタンをクリックするとログアウト処理が実行される', async () => {
        const mockSetIsLoggedIn = jest.fn();
        const mockSetUserId = jest.fn();
        mockUseUser.mockReturnValue({
            isLoggedIn: true,
            userId: 'test-user-id',
            error: null,
            setIsLoggedIn: mockSetIsLoggedIn,
            setUserId: mockSetUserId
        });
        
        await act(async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <UserContextProvider>
                        <LoginButton/>
                    </UserContextProvider>
                </QueryClientProvider>
            );
        });
        
        fireEvent.click(screen.getByText('ログアウト'));
        
        await waitFor(() => {
            expect(mockSetIsLoggedIn).toHaveBeenCalledWith(false);
            expect(mockSetUserId).toHaveBeenCalledWith(null);
            expect(mockReload).toHaveBeenCalled();
        });
    });
    
    it('ログアウト処理が失敗した場合、エラーがコンソールに出力される', async () => {
        const mockSetIsLoggedIn = jest.fn();
        const mockSetUserId = jest.fn();
        mockUseUser.mockReturnValue({
            isLoggedIn: true,
            userId: 'test-user-id',
            error: null,
            setIsLoggedIn: mockSetIsLoggedIn,
            setUserId: mockSetUserId
        });
        
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                statusText: 'Internal Server Error',
            } as Response)
        );
        
        await act(async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <UserContextProvider>
                        <LoginButton/>
                    </UserContextProvider>
                </QueryClientProvider>
            );
        });
        
        fireEvent.click(screen.getByText('ログアウト'));
        
    });
    
    it('ログアウト処理中にネットワークエラーが発生した場合、エラーがコンソールに出力される', async () => {
        const mockSetIsLoggedIn = jest.fn();
        const mockSetUserId = jest.fn();
        mockUseUser.mockReturnValue({
            isLoggedIn: true,
            userId: 'test-user-id',
            error: null,
            setIsLoggedIn: mockSetIsLoggedIn,
            setUserId: mockSetUserId
        });
        
        global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
        
        await act(async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <UserContextProvider>
                        <LoginButton/>
                    </UserContextProvider>
                </QueryClientProvider>
            );
        });
        
        fireEvent.click(screen.getByText('ログアウト'));
        
    });
    
    it('アクセシビリティ違反がないこと', async () => {
        mockUseUser.mockReturnValue({
            isLoggedIn: false,
            userId: null,
            error: null,
            setIsLoggedIn: jest.fn(),
            setUserId: jest.fn()
        });
        
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
