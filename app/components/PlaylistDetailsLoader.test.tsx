// app/components/PlaylistDetailsLoader.test.tsx

import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {axe, toHaveNoViolations} from 'jest-axe';
import PlaylistDetailsLoader from './PlaylistDetailsLoader';
import {expect} from '@jest/globals';

// jest-axeのマッチャーを追加
expect.extend(toHaveNoViolations);

// PlaylistDetailsコンポーネントのモック
jest.mock('./PlaylistDetails', () => {
    return function MockPlaylistDetails() {
        return <div data-testid="playlist-details">Playlist Details</div>;
    };
});

// LoadingSpinnerコンポーネントのモック
jest.mock('./LoadingSpinner', () => {
    return function MockLoadingSpinner({loading}: { loading: boolean }) {
        return loading ? <div data-testid="loading-spinner">Loading...</div> : null;
    };
});

// グローバルフェッチ関数のモック
global.fetch = jest.fn();

describe('PlaylistDetailsLoader', () => {
    let queryClient: QueryClient;
    
    // 各テストの前にQueryClientを初期化し、フェッチのモックをクリア
    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
        (global.fetch as jest.Mock).mockClear();
    });
    
    it('データ取得中にローディングスピナーを表示する', async () => {
        // フェッチが完了しないモックを設定
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            new Promise(() => {
            })
        );
        
        // コンポーネントをレンダリング
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistDetailsLoader playlistId="123"/>
            </QueryClientProvider>
        );
        
        // ローディングスピナーが表示されていることを確認
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
    
    it('データ取得成功時にプレイリスト詳細を表示する', async () => {
        const mockData = {
            tracks: {items: []},
            genreCounts: {},
            recommendations: [],
            playlistName: 'Test Playlist',
            ownerId: 'owner123',
        };
        
        // フェッチが成功するモックを設定
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData),
            })
        );
        
        // コンポーネントをレンダリング
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistDetailsLoader playlistId="123"/>
            </QueryClientProvider>
        );
        
        // プレイリスト詳細が表示されていることを確認
        await waitFor(() => {
            expect(screen.getByTestId('playlist-details')).toBeInTheDocument();
        });
    });
    
    it('データ取得失敗時にエラーメッセージを表示する', async () => {
        // フェッチが失敗するモックを設定
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
            })
        );
        
        // コンポーネントをレンダリング
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistDetailsLoader playlistId="123"/>
            </QueryClientProvider>
        );
        
        // エラーメッセージが表示されていることを確認
        await waitFor(() => {
            expect(screen.getByText('プレイリスト取得中にエラーが発生しました')).toBeInTheDocument();
        });
    });
    
    it('アクセシビリティ違反がないことを確認する', async () => {
        const mockData = {
            tracks: {items: []},
            genreCounts: {},
            recommendations: [],
            playlistName: 'Test Playlist',
            ownerId: 'owner123',
        };
        
        // フェッチが成功するモックを設定
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData),
            })
        );
        
        // コンテナをレンダリング
        const {container} = render(
            <QueryClientProvider client={queryClient}>
                <PlaylistDetailsLoader playlistId="123"/>
            </QueryClientProvider>
        );
        
        // プレイリスト詳細が表示されていることを確認
        await waitFor(() => {
            expect(screen.getByTestId('playlist-details')).toBeInTheDocument();
        });
        
        // アクセシビリティ違反がないことを確認
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
