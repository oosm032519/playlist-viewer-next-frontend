// app/components/LoginButton.test.tsx

import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {axe, toHaveNoViolations} from 'jest-axe';
import {useRouter} from 'next/navigation';
import {useUser} from '../context/UserContext';
import LoginButton from './LoginButton';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

// モックの設定
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../context/UserContext', () => ({
    useUser: jest.fn(),
}));

const queryClient = new QueryClient();

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>
            {ui}
        </QueryClientProvider>
    );
};

describe('LoginButton コンポーネント', () => {
    let originalFetch: typeof global.fetch;
    let originalConsoleError: typeof console.error;
    
    beforeAll(() => {
        originalFetch = global.fetch;
        originalConsoleError = console.error;
        console.error = jest.fn();
    });
    
    afterAll(() => {
        global.fetch = originalFetch;
        console.error = originalConsoleError;
    });
    
    beforeEach(() => {
        jest.clearAllMocks();
        Object.defineProperty(window, 'location', {
            value: {reload: jest.fn()},
            writable: true
        });
    });
    
    test('ログインしていない状態でレンダリングされる', () => {
        (useUser as jest.Mock).mockReturnValue({isLoggedIn: false});
        renderWithProviders(<LoginButton/>);
        expect(screen.getByText('Spotifyでログイン')).toBeInTheDocument();
    });
    
    test('ログインしている状態でレンダリングされる', () => {
        (useUser as jest.Mock).mockReturnValue({isLoggedIn: true});
        renderWithProviders(<LoginButton/>);
        expect(screen.getByText('ログアウト')).toBeInTheDocument();
    });
    
    test('ログインボタンがクリックされたときの動作', () => {
        const push = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({push});
        (useUser as jest.Mock).mockReturnValue({isLoggedIn: false});
        
        renderWithProviders(<LoginButton/>);
        fireEvent.click(screen.getByText('Spotifyでログイン'));
        expect(push).toHaveBeenCalledWith('/api/login');
    });
    
    test('ログアウトボタンがクリックされたときの動作', async () => {
        (useUser as jest.Mock).mockReturnValue({isLoggedIn: true});
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({}),
        });
        
        renderWithProviders(<LoginButton/>);
        fireEvent.click(screen.getByText('ログアウト'));
        
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/logout', expect.any(Object));
            expect(window.location.reload).toHaveBeenCalled();
        });
    });
    
    test('ログアウト処理でエラーが発生した場合', async () => {
        (useUser as jest.Mock).mockReturnValue({isLoggedIn: true});
        global.fetch = jest.fn().mockRejectedValue(new Error('ログアウトに失敗しました'));
        
        renderWithProviders(<LoginButton/>);
        fireEvent.click(screen.getByText('ログアウト'));
        
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith('ログアウトエラー:', expect.any(Error));
        });
    });
    
    test('アクセシビリティテスト', async () => {
        (useUser as jest.Mock).mockReturnValue({isLoggedIn: false});
        const {container} = renderWithProviders(<LoginButton/>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
