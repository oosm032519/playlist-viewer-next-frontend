import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import {axe, toHaveNoViolations} from 'jest-axe';
import LoginButton from './LoginButton';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

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
        render(<LoginButton isLoggedIn={false}/>);
        const button = screen.getByRole('button', {name: /Spotifyでログイン/i});
        expect(button).toBeInTheDocument();
    });
    
    test('ログアウトボタンが正しくレンダリングされる', () => {
        render(<LoginButton isLoggedIn={true}/>);
        const button = screen.getByRole('button', {name: /ログアウト/i});
        expect(button).toBeInTheDocument();
    });
    
    test('ログインボタンをクリックするとリダイレクトされる', () => {
        render(<LoginButton isLoggedIn={false}/>);
        const button = screen.getByRole('button', {name: /Spotifyでログイン/i});
        fireEvent.click(button);
        
        expect(window.location.href).toBe(process.env.NEXT_PUBLIC_SPOTIFY_AUTH_URL || 'http://localhost:8080/oauth2/authorization/spotify');
    });
    
    test('ログアウトボタンをクリックするとログアウト処理が実行される', async () => {
        const postSpy = jest.spyOn(axios, 'post').mockResolvedValueOnce({});
        
        render(<LoginButton isLoggedIn={true}/>);
        const button = screen.getByRole('button', {name: /ログアウト/i});
        fireEvent.click(button);
        
        await waitFor(() => {
            expect(postSpy).toHaveBeenCalledWith('/api/logout', {}, {withCredentials: true});
            expect(window.location.reload).toHaveBeenCalled();
        });
    });
    
    test('アクセシビリティテスト', async () => {
        const {container} = render(<LoginButton isLoggedIn={false}/>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
