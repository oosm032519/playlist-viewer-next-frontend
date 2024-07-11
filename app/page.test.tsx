// app/page.test.tsx

import React from 'react';
import {render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import '@testing-library/jest-dom';
import {axe, toHaveNoViolations} from 'jest-axe';
import Home from './page';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {UserContextProvider} from './context/UserContext'; // UserContextProviderをインポート
import {expect} from '@jest/globals';

// jest-axeのカスタムマッチャーを追加
expect.extend(toHaveNoViolations);

// QueryClientのインスタンスを作成
const queryClient = new QueryClient();

// fetchをモック
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({userId: 'mockUserId'}),
        headers: new Headers(),
        redirected: false,
        statusText: 'OK',
        type: 'basic',
        url: '',
        clone: jest.fn(),
        body: null,
        bodyUsed: false,
        arrayBuffer: jest.fn(),
        blob: jest.fn(),
        formData: jest.fn(),
        text: jest.fn(),
    } as Response)
);

// checkSession関数をモック
jest.mock('./lib/checkSession', () => ({
    checkSession: jest.fn().mockResolvedValue(true),
}));

// PlaylistSearchFormコンポーネントをモック
jest.mock('./components/PlaylistSearchForm', () => ({
    __esModule: true,
    default: ({onSearch}: { onSearch: (playlists: any[]) => void }) => (
        <button onClick={() => onSearch([{id: '1', name: 'Test Playlist'}])}>
            Search
        </button>
    ),
}));

// LoginButtonコンポーネントをモック
jest.mock('./components/LoginButton', () => ({
    __esModule: true,
    default: ({onLoginSuccess}: { onLoginSuccess: () => void }) => (
        <button onClick={onLoginSuccess}>Login</button>
    ),
}));

// PlaylistIdFormコンポーネントをモック
jest.mock('./components/PlaylistIdForm', () => ({
    __esModule: true,
    default: ({onPlaylistSelect}: { onPlaylistSelect: (id: string) => void }) => (
        <button onClick={() => onPlaylistSelect('1')}>Select Playlist</button>
    ),
}));

// FollowedPlaylistsコンポーネントをモック
jest.mock('./components/FollowedPlaylists', () => ({
    __esModule: true,
    default: ({onPlaylistClick}: { onPlaylistClick: (id: string) => void }) => (
        <button onClick={() => onPlaylistClick('1')}>Followed Playlist</button>
    ),
}));

// PlaylistTableコンポーネントをモック
jest.mock('./components/PlaylistTable', () => ({
    __esModule: true,
    default: ({playlists, onPlaylistClick}: { playlists: any[], onPlaylistClick: (id: string) => void }) => (
        <div>
            {playlists.map((playlist) => (
                <button key={playlist.id} onClick={() => onPlaylistClick(playlist.id)}>
                    {playlist.name}
                </button>
            ))}
        </div>
    ),
}));

// PlaylistDetailsLoaderコンポーネントをモック
jest.mock('./components/PlaylistDetailsLoader', () => ({
    __esModule: true,
    default: ({playlistId, userId}: { playlistId: string, userId: string }) => (
        <div>Loading details for {playlistId} by {userId}</div>
    ),
}));

describe('Home Component', () => {
    /**
     * Homeコンポーネントがクラッシュせずにレンダリングされることを確認するテスト
     */
    it('renders without crashing', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider> {/* UserContextProviderでラップ */}
                    <Home/>
                </UserContextProvider>
            </QueryClientProvider>
        );
        expect(screen.getByText('Playlist Viewer')).toBeInTheDocument();
    });
    
    /**
     * ログイン成功時の処理を確認するテスト
     */
    it('handles login success', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider> {/* UserContextProviderでラップ */}
                    <Home/>
                </UserContextProvider>
            </QueryClientProvider>
        );
        
        await act(async () => {
            fireEvent.click(screen.getByText('Login'));
        });
        
        await waitFor(() => expect(screen.getByText('Followed Playlist')).toBeInTheDocument());
    });
    
    /**
     * プレイリスト検索の処理を確認するテスト
     */
    it('handles playlist search', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider> {/* UserContextProviderでラップ */}
                    <Home/>
                </UserContextProvider>
            </QueryClientProvider>
        );
        
        await act(async () => {
            fireEvent.click(screen.getByText('Search'));
        });
        
        await waitFor(() => expect(screen.getByText('Test Playlist')).toBeInTheDocument());
    });
    
    /**
     * プレイリスト選択の処理を確認するテスト
     */
    it('handles playlist selection', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider> {/* UserContextProviderでラップ */}
                    <Home/>
                </UserContextProvider>
            </QueryClientProvider>
        );
        
        await act(async () => {
            fireEvent.click(screen.getByText('Select Playlist'));
        });
        
        await waitFor(() => expect(screen.getByText('Loading details for 1 by mockUserId')).toBeInTheDocument());
    });
    
    /**
     * アクセシビリティのテスト
     */
    it('is accessible', async () => {
        const {container} = render(
            <QueryClientProvider client={queryClient}>
                <UserContextProvider> {/* UserContextProviderでラップ */}
                    <Home/>
                </UserContextProvider>
            </QueryClientProvider>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
