// app/context/FavoriteContext.test.tsx

import React from 'react';
import {render, screen, act, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {FavoriteProvider, FavoriteContext} from '@/app/context/FavoriteContext';
import {axe, toHaveNoViolations} from 'jest-axe';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

// モックの設定
global.fetch = jest.fn();

// 環境変数の設定
process.env.NEXT_PUBLIC_BACKEND_URL = 'http://localhost:3000';

// セッションストレージのモック
const mockSessionStorage = {
    getItem: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
    value: mockSessionStorage,
});

// テストコンポーネントの定義
const TestComponent: React.FC = () => {
    const {favorites, addFavorite, removeFavorite, fetchFavorites} = React.useContext(FavoriteContext);
    
    return (
        <div>
            <button onClick={() => addFavorite('1', 'Test Playlist', 10)}>Add Favorite</button>
            <button onClick={() => removeFavorite('1')}>Remove Favorite</button>
            <button onClick={() => fetchFavorites()}>Fetch Favorites</button>
            <ul>
                {Object.entries(favorites).map(([id, {playlistName}]) => (
                    <li key={id}>{playlistName}</li>
                ))}
            </ul>
        </div>
    );
};

describe('FavoriteContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockSessionStorage.getItem.mockReturnValue('mock-jwt-token');
    });
    
    it('初期状態でお気に入りが空であること', () => {
        render(
            <FavoriteProvider>
                <TestComponent/>
            </FavoriteProvider>
        );
        
        expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });
    
    it('お気に入りを追加できること', async () => {
        render(
            <FavoriteProvider>
                <TestComponent/>
            </FavoriteProvider>
        );
        
        await act(async () => {
            await userEvent.click(screen.getByText('Add Favorite'));
        });
        
        expect(screen.getByText('Test Playlist')).toBeInTheDocument();
    });
    
    it('お気に入りを削除できること', async () => {
        render(
            <FavoriteProvider>
                <TestComponent/>
            </FavoriteProvider>
        );
        
        await act(async () => {
            await userEvent.click(screen.getByText('Add Favorite'));
        });
        
        expect(screen.getByText('Test Playlist')).toBeInTheDocument();
        
        await act(async () => {
            await userEvent.click(screen.getByText('Remove Favorite'));
        });
        
        expect(screen.queryByText('Test Playlist')).not.toBeInTheDocument();
    });
    
    it('お気に入りを取得できること', async () => {
        const mockFetchResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue([
                {
                    playlistId: '1',
                    playlistName: 'Fetched Playlist',
                    totalTracks: 5,
                    addedAt: '2024-07-23T00:00:00.000Z'
                }
            ])
        };
        (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);
        
        render(
            <FavoriteProvider>
                <TestComponent/>
            </FavoriteProvider>
        );
        
        await waitFor(() => {
            expect(screen.getByText('Fetched Playlist')).toBeInTheDocument();
        });
        
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/playlists/favorites', {
            headers: {
                'Authorization': 'Bearer mock-jwt-token',
            },
        });
    });
    
    it('お気に入り取得時にエラーが発生した場合、コンソールにエラーが出力されること', async () => {
        const mockFetchResponse = {
            ok: false,
        };
        (global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);
        console.error = jest.fn();
        
        render(
            <FavoriteProvider>
                <TestComponent/>
            </FavoriteProvider>
        );
        
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith('お気に入り情報の取得に失敗しました。');
        });
    });
    
    it('アクセシビリティ違反がないこと', async () => {
        const {container} = render(
            <FavoriteProvider>
                <TestComponent/>
            </FavoriteProvider>
        );
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
