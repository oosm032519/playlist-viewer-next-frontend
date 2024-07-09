import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import {axe, toHaveNoViolations} from 'jest-axe';
import LoginButton from './LoginButton';
import {expect} from '@jest/globals';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

expect.extend(toHaveNoViolations);

const queryClient = new QueryClient();

const renderWithQueryClient = (ui: string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<React.AwaitedReactNode> | React.JSX.Element | null | undefined) => {
    return render(
        <QueryClientProvider client={queryClient}>
            {ui}
        </QueryClientProvider>
    );
};

describe('LoginButton コンポーネント', () => {
    beforeAll(() => {
        // window.location.reloadをモック
        Object.defineProperty(window, 'location', {
            writable: true,
            value: {reload: jest.fn(), href: ''},
        });
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    test('ログインボタンが正しくレンダリングされる', () => {
        renderWithQueryClient(<LoginButton isLoggedIn={false}/>);
        const button = screen.getByRole('button', {name: /Spotifyでログイン/i});
        expect(button).toBeInTheDocument();
    });
    
    test('ログアウトボタンが正しくレンダリングされる', () => {
        renderWithQueryClient(<LoginButton isLoggedIn={true}/>);
        const button = screen.getByRole('button', {name: /ログアウト/i});
        expect(button).toBeInTheDocument();
    });
    
    test('ログインボタンをクリックするとリダイレクトされる', () => {
        renderWithQueryClient(<LoginButton isLoggedIn={false}/>);
        const button = screen.getByRole('button', {name: /Spotifyでログイン/i});
        fireEvent.click(button);
        
        expect(window.location.href).toBe(process.env.NEXT_PUBLIC_SPOTIFY_AUTH_URL || 'http://localhost:8080/oauth2/authorization/spotify');
    });
    
    test('ログアウトボタンをクリックするとログアウト処理が実行される', async () => {
        const postSpy = jest.spyOn(axios, 'post').mockResolvedValueOnce({});
        
        renderWithQueryClient(<LoginButton isLoggedIn={true}/>);
        const button = screen.getByRole('button', {name: /ログアウト/i});
        fireEvent.click(button);
        
        await waitFor(() => {
            expect(postSpy).toHaveBeenCalledWith('/api/logout', {}, {withCredentials: true});
            expect(window.location.reload).toHaveBeenCalled();
        });
    });
    
    test('アクセシビリティテスト', async () => {
        const {container} = renderWithQueryClient(<LoginButton isLoggedIn={false}/>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
