// app/context/FavoriteContext.test.tsx

import React from 'react';
import {render, screen, act, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {FavoriteProvider, FavoriteContext} from '@/app/context/FavoriteContext';
import {axe, toHaveNoViolations} from 'jest-axe';
import {expect} from '@jest/globals';
import {UserContextProvider} from '@/app/context/UserContext'; // UserContextProviderをインポート

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
        // Cookieを設定
        document.cookie = 'sessionId=test-session-id';
    });
    
    it('初期状態でお気に入りが空であること', () => {
        render(
            <UserContextProvider>
                <FavoriteProvider>
                    <TestComponent/>
                </FavoriteProvider>
            </UserContextProvider>
        );
        
        expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });
    
    it('お気に入りを追加できること', async () => {
        render(
            <UserContextProvider>
                <FavoriteProvider>
                    <TestComponent/>
                </FavoriteProvider>
            </UserContextProvider>
        );
        
        await act(async () => {
            await userEvent.click(screen.getByText('Add Favorite'));
        });
        
        expect(screen.getByText('Test Playlist')).toBeInTheDocument();
    });
    
    it('お気に入りを削除できること', async () => {
        render(
            <UserContextProvider>
                <FavoriteProvider>
                    <TestComponent/>
                </FavoriteProvider>
            </UserContextProvider>
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
    
    it('アクセシビリティ違反がないこと', async () => {
        const {container} = render(
            <UserContextProvider>
                <FavoriteProvider>
                    <TestComponent/>
                </FavoriteProvider>
            </UserContextProvider>
        );
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
