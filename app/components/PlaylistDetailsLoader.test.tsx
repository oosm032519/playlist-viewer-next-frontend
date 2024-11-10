// app/components/PlaylistDetailsLoader.test.tsx

import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {toHaveNoViolations} from 'jest-axe';
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

// next/imageのモック
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img
            src={props.src.startsWith('/') ? props.src : `/${props.src}`}
            alt={props.alt}
            width={props.width}
            height={props.height}
        />;
    },
}));

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
        (global.fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {
        }));
        
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistDetailsLoader playlistId="123"/>
            </QueryClientProvider>
        );
        
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
    
    it('データ取得成功時にプレイリスト詳細を表示する（1時間以上）', async () => {
        const mockData = {
            tracks: {items: []},
            genreCounts: {},
            recommendations: [],
            playlistName: 'Test Playlist',
            ownerId: 'owner123',
            totalDuration: 3600000,
            averageAudioFeatures: {},
            ownerName: 'Owner Name',
        };
        
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData),
            })
        );
        
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistDetailsLoader playlistId="123"/>
            </QueryClientProvider>
        );
        
        await waitFor(() => {
            expect(screen.getByTestId('playlist-details')).toBeInTheDocument();
        });
    });
    
    it('データ取得成功時にプレイリスト詳細を表示する（1時間未満）', async () => {
        const mockData = {
            tracks: {items: []},
            genreCounts: {},
            recommendations: [],
            playlistName: 'Test Playlist',
            ownerId: 'owner123',
            totalDuration: 1800000,
            averageAudioFeatures: {},
            ownerName: 'Owner Name',
        };
        
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData),
            })
        );
        
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistDetailsLoader playlistId="123"/>
            </QueryClientProvider>
        );
        
        await waitFor(() => {
            expect(screen.getByTestId('playlist-details')).toBeInTheDocument();
        });
    });
    
    it('エラー発生時にエラーメッセージを表示する', async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 500
            })
        );
        
        render(
            <QueryClientProvider client={queryClient}>
                <PlaylistDetailsLoader playlistId="123"/>
            </QueryClientProvider>
        );
        
        await waitFor(() => {
            expect(screen.getByText(/プレイリスト取得中にエラーが発生しました/)).toBeInTheDocument();
        });
    });
});
