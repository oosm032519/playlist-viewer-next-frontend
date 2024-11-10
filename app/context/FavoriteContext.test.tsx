// app/context/FavoriteContext.test.tsx

import React from 'react';
import {render, screen, waitFor, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {FavoriteProvider, FavoriteContext} from '@/app/context/FavoriteContext';
import {UserContextProvider} from '@/app/context/UserContext';
import {expect} from '@jest/globals'

// モックの作成
jest.mock('./UserContext', () => ({
    ...jest.requireActual('./UserContext'),
    useUser: jest.fn(() => ({
        isLoggedIn: true,
        userId: 'testUser',
        error: null,
        setIsLoggedIn: jest.fn(),
        setUserId: jest.fn(),
    })),
}));

// フェッチのモック
const createMockResponse = (body: any): Response => ({
    ok: true,
    json: () => Promise.resolve(body),
    headers: new Headers(),
    redirected: false,
    status: 200,
    statusText: "OK",
    type: 'default' as ResponseType,
    url: '',
    body: null,
    bodyUsed: false,
    text: () => Promise.resolve(''),
} as unknown as Response);

global.fetch = jest.fn(() => Promise.resolve(createMockResponse([])));

describe('FavoriteProvider', () => {
    // テスト前の準備
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    // 初期状態のテスト
    it('should initialize with empty favorites', async () => {
        await act(async () => {
            render(
                <UserContextProvider>
                    <FavoriteProvider>
                        <FavoriteContext.Consumer>
                            {(value) => <div data-testid="favorites">{JSON.stringify(value.favorites)}</div>}
                        </FavoriteContext.Consumer>
                    </FavoriteProvider>
                </UserContextProvider>
            );
        });
        
        expect(screen.getByTestId('favorites')).toHaveTextContent('{}');
    });
    
    // お気に入り追加のテスト
    it('should add a favorite', async () => {
        await act(async () => {
            render(
                <UserContextProvider>
                    <FavoriteProvider>
                        <FavoriteContext.Consumer>
                            {({favorites, addFavorite}) => (
                                <>
                                    <div data-testid="favorites">{JSON.stringify(favorites)}</div>
                                    <button onClick={() => addFavorite('1', 'Test Playlist', 10)}>Add Favorite</button>
                                </>
                            )}
                        </FavoriteContext.Consumer>
                    </FavoriteProvider>
                </UserContextProvider>
            );
        });
        
        await act(async () => {
            await userEvent.click(screen.getByText('Add Favorite'));
        });
        
        await waitFor(() => {
            const favoritesElement = screen.getByTestId('favorites');
            expect(favoritesElement).toHaveTextContent('"1":{"playlistName":"Test Playlist","totalTracks":10');
        });
    });
    
    // お気に入り削除のテスト
    it('should remove a favorite', async () => {
        global.fetch = jest.fn(() => Promise.resolve(createMockResponse([{
            playlistId: '1',
            playlistName: 'Test Playlist',
            totalTracks: 10,
            addedAt: '2023-01-01T00:00:00.000Z'
        }])));
        
        await act(async () => {
            render(
                <UserContextProvider>
                    <FavoriteProvider>
                        <FavoriteContext.Consumer>
                            {({favorites, removeFavorite}) => (
                                <>
                                    <div data-testid="favorites">{JSON.stringify(favorites)}</div>
                                    <button onClick={() => removeFavorite('1')}>Remove Favorite</button>
                                </>
                            )}
                        </FavoriteContext.Consumer>
                    </FavoriteProvider>
                </UserContextProvider>
            );
        });
        
        await waitFor(() => {
            expect(screen.getByTestId('favorites')).toHaveTextContent('"1":');
        });
        
        await act(async () => {
            await userEvent.click(screen.getByText('Remove Favorite'));
        });
        
        await waitFor(() => {
            expect(screen.getByTestId('favorites')).toHaveTextContent('{}');
        });
    });
    
    // お気に入りフェッチのテスト
    it('should fetch favorites when logged in', async () => {
        global.fetch = jest.fn(() => Promise.resolve(createMockResponse([{
            playlistId: '1',
            playlistName: 'Test Playlist',
            totalTracks: 10,
            addedAt: '2023-01-01T00:00:00.000Z'
        }])));
        
        await act(async () => {
            render(
                <UserContextProvider>
                    <FavoriteProvider>
                        <FavoriteContext.Consumer>
                            {({favorites}) => <div data-testid="favorites">{JSON.stringify(favorites)}</div>}
                        </FavoriteContext.Consumer>
                    </FavoriteProvider>
                </UserContextProvider>
            );
        });
        
        await waitFor(() => {
            expect(screen.getByTestId('favorites')).toHaveTextContent('"1":{"playlistName":"Test Playlist","totalTracks":10');
        });
        
        expect(global.fetch).toHaveBeenCalledWith('/api/playlists/favorites', {credentials: 'include'});
    });
});
