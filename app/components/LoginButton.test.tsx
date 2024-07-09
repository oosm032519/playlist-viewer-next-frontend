// LoginButton.test.tsx

import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {axe, toHaveNoViolations} from 'jest-axe';
import LoginButton from './LoginButton';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

// モックの設定
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

const mockMutate = jest.fn();
jest.mock('@tanstack/react-query', () => ({
    ...jest.requireActual('@tanstack/react-query'),
    useMutation: () => ({
        mutate: mockMutate,
    }),
}));

describe('LoginButton', () => {
    const queryClient = new QueryClient();
    
    const renderComponent = (isLoggedIn: boolean) => {
        return render(
            <QueryClientProvider client={queryClient}>
                <LoginButton isLoggedIn={isLoggedIn}/>
            </QueryClientProvider>
        );
    };
    
    beforeEach(() => {
        jest.clearAllMocks();
        Object.defineProperty(window, 'location', {
            value: {href: '', reload: jest.fn()},
            writable: true,
        });
    });
    
    it('ログインしていない場合、"Spotifyでログイン"ボタンを表示する', () => {
        renderComponent(false);
        expect(screen.getByRole('button', {name: 'Spotifyでログイン'})).toBeInTheDocument();
    });
    
    it('ログインしている場合、"ログアウト"ボタンを表示する', () => {
        renderComponent(true);
        expect(screen.getByRole('button', {name: 'ログアウト'})).toBeInTheDocument();
    });
    
    it('ログインボタンをクリックすると、Spotify認証URLにリダイレクトする', () => {
        renderComponent(false);
        fireEvent.click(screen.getByRole('button', {name: 'Spotifyでログイン'}));
        expect(window.location.href).toBe('http://localhost:8080/oauth2/authorization/spotify');
    });
    
    it('ログアウトボタンをクリックすると、ログアウトミューテーションを実行する', async () => {
        renderComponent(true);
        fireEvent.click(screen.getByRole('button', {name: 'ログアウト'}));
        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalled();
        });
    });
    
    it('アクセシビリティ違反がないこと', async () => {
        const {container} = renderComponent(false);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
