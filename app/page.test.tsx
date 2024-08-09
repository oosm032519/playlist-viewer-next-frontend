// app/page.test.tsx

import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {axe, toHaveNoViolations} from 'jest-axe';
import Home from './page';
import {UserContextProvider} from './context/UserContext';
import {PlaylistContextProvider} from './context/PlaylistContext';
import {FavoriteProvider} from './context/FavoriteContext';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

// モックの設定
jest.mock('./components/LoginButton', () => {
    return function MockLoginButton() {
        return <button>Login</button>;
    };
});

jest.mock('./components/PlaylistIdForm', () => {
    return function MockPlaylistIdForm() {
        return <form data-testid="playlist-id-form"></form>;
    };
});

jest.mock('./components/PlaylistSearchForm', () => {
    return function MockPlaylistSearchForm() {
        return <form data-testid="playlist-search-form"></form>;
    };
});

jest.mock('./components/PlaylistDisplay', () => {
    return function MockPlaylistDisplay() {
        return <div data-testid="playlist-display"></div>;
    };
});

jest.mock('./components/FavoritePlaylistsTable', () => {
    return function MockFavoritePlaylistsTable() {
        return <div data-testid="favorite-playlists-table"></div>;
    };
});

// グローバルなfetchのモック
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({status: 'success', userId: 'mockUserId'}),
    })
) as jest.Mock;

describe('Home Component', () => {
    beforeEach(() => {
        // 各テストの前にfetchモックをリセット
        (global.fetch as jest.Mock).mockClear();
        // URLハッシュをリセット
        Object.defineProperty(window, 'location', {
            value: {
                hash: '',
                pathname: '/',
                search: '',
            },
            writable: true,
        });
    });
    
    test('renders main components', async () => {
        render(
            <UserContextProvider>
                <PlaylistContextProvider>
                    <FavoriteProvider>
                        <Home/>
                    </FavoriteProvider>
                </PlaylistContextProvider>
            </UserContextProvider>
        );
        
        await waitFor(() => {
            expect(screen.getByText('Playlist Viewer')).toBeInTheDocument();
            expect(screen.getByText('Login')).toBeInTheDocument();
            expect(screen.getByTestId('playlist-id-form')).toBeInTheDocument();
            expect(screen.getByTestId('playlist-search-form')).toBeInTheDocument();
            expect(screen.getByTestId('playlist-display')).toBeInTheDocument();
        });
    });
    
    test('handles login flow', async () => {
        // URLハッシュを模倣
        Object.defineProperty(window, 'location', {
            value: {
                hash: '#token=mockToken',
                pathname: '/',
                search: '',
            },
            writable: true,
        });
        
        (global.fetch as jest.Mock)
            .mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({sessionId: 'mockSessionId'}),
                })
            )
            .mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({status: 'success', userId: 'mockUserId'}),
                })
            )
            .mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({}),
                })
            );
        
        render(
            <UserContextProvider>
                <PlaylistContextProvider>
                    <FavoriteProvider>
                        <Home/>
                    </FavoriteProvider>
                </PlaylistContextProvider>
            </UserContextProvider>
        );
        
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(3);
        });
        
        // ログイン成功時の表示を確認
        await waitFor(() => {
            expect(screen.queryByText('セッション初期化に失敗しました')).not.toBeInTheDocument();
            expect(screen.getByTestId('favorite-playlists-table')).toBeInTheDocument();
        }, {timeout: 3000});
    });
    
    test('handles login error', async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 500,
            })
        );
        
        render(
            <UserContextProvider>
                <PlaylistContextProvider>
                    <FavoriteProvider>
                        <Home/>
                    </FavoriteProvider>
                </PlaylistContextProvider>
            </UserContextProvider>
        );
        
        await waitFor(() => {
            expect(screen.getByText('セッション初期化に失敗しました')).toBeInTheDocument();
        });
    });
    
    test('accessibility check', async () => {
        const {container} = render(
            <UserContextProvider>
                <PlaylistContextProvider>
                    <FavoriteProvider>
                        <Home/>
                    </FavoriteProvider>
                </PlaylistContextProvider>
            </UserContextProvider>
        );
        
        await waitFor(() => {
            expect(screen.getByText('Playlist Viewer')).toBeInTheDocument();
        });
        
        const results = await axe(container);
        
        // アクセシビリティ違反がある場合、それらを出力
        if (results.violations.length > 0) {
            console.log('Accessibility violations:', results.violations);
        }
        
        // heading-order以外のアクセシビリティ違反がないことを確認
        const nonHeadingOrderViolations = results.violations.filter(
            violation => violation.id !== 'heading-order'
        );
        expect(nonHeadingOrderViolations).toHaveLength(0);
    });
});
