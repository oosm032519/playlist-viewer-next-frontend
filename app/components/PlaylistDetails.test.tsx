import React from 'react';
import {render, screen, within} from '@testing-library/react';
import {axe, toHaveNoViolations} from 'jest-axe';
import '@testing-library/jest-dom';
import PlaylistDetails from './PlaylistDetails';
import {Track} from '../types/track';
import {expect} from '@jest/globals';

// モックコンポーネントの作成
jest.mock('./PlaylistDetailsTable', () => ({
    PlaylistDetailsTable: ({tracks}: { tracks: Track[] }) => (
        <div data-testid="playlist-details-table">
            Mocked PlaylistDetailsTable
            <span data-testid="track-count">{tracks.length}</span>
        </div>
    ),
}));

jest.mock('./GenreChart', () => ({
    __esModule: true,
    default: ({genreCounts}: { genreCounts: { [genre: string]: number } }) => (
        <div data-testid="genre-chart">
            Mocked GenreChart
            <span data-testid="genre-count">{Object.keys(genreCounts).length}</span>
        </div>
    ),
}));

jest.mock('./RecommendationsTable', () => ({
    RecommendationsTable: ({tracks, ownerId, userId, playlistId}: {
        tracks: Track[],
        ownerId: string,
        userId: string,
        playlistId: string
    }) => (
        <div data-testid="recommendations-table">
            Mocked RecommendationsTable
            <span data-testid="recommendation-count">{tracks.length}</span>
            <span data-testid="owner-id">{ownerId}</span>
            <span data-testid="user-id">{userId}</span>
            <span data-testid="playlist-id">{playlistId}</span>
        </div>
    ),
}));

// jest-axeの拡張機能を追加
expect.extend(toHaveNoViolations);

describe('PlaylistDetails', () => {
    // テスト用のモックデータを定義
    const mockTracks: Track[] = [
        {
            id: '1',
            name: 'Track 1',
            artists: [{
                name: 'Artist 1',
                externalUrls: undefined
            }],
            album: {
                name: 'Album 1',
                externalUrls: undefined,
                images: []
            },
            durationMs: 180000,
            previewUrl: undefined
        },
    ];
    
    const mockGenreCounts = {
        'Pop': 5,
        'Rock': 3,
    };
    
    const mockRecommendations: Track[] = [
        {
            id: '2',
            name: 'Recommended Track',
            artists: [{
                name: 'Recommended Artist',
                externalUrls: undefined
            }],
            album: {
                name: 'Recommended Album',
                externalUrls: undefined,
                images: []
            },
            durationMs: 200000,
            previewUrl: undefined
        },
    ];
    
    // デフォルトのプロパティを定義
    const defaultProps = {
        tracks: mockTracks,
        genreCounts: mockGenreCounts,
        recommendations: mockRecommendations,
        playlistName: 'Test Playlist',
        ownerId: 'owner123',
        userId: 'user123',
        playlistId: 'playlist123',
        totalDuration: '3:00:00', // 例として3時間
        averageAudioFeatures: {
            danceability: 0.5,
            energy: 0.5,
            key: 5,
            loudness: -5,
            mode: 1,
            speechiness: 0.05,
            acousticness: 0.1,
            instrumentalness: 0.0,
            liveness: 0.1,
            valence: 0.5,
            tempo: 120,
            durationMs: 180000,
            timeSignature: 4,
        }, // 例として適当な値を設定
        totalTracks: 1, // mockTracksの長さに合わせる
        ownerName: 'Owner Name', // 例としてオーナーの名前を設定
    };
    
    it('renders PlaylistDetailsTable with correct number of tracks', () => {
        // PlaylistDetailsコンポーネントをレンダリング
        render(<PlaylistDetails {...defaultProps} />);
        const playlistDetailsTable = screen.getByTestId('playlist-details-table');
        // PlaylistDetailsTableが正しくレンダリングされているか確認
        expect(playlistDetailsTable).toBeInTheDocument();
        // トラックの数が正しいか確認
        expect(within(playlistDetailsTable).getByTestId('track-count')).toHaveTextContent('1');
    });
    
    it('renders GenreDistributionChart when genreCounts is not empty', () => {
        // PlaylistDetailsコンポーネントをレンダリング
        render(<PlaylistDetails {...defaultProps} />);
        const genreChart = screen.getByTestId('genre-chart');
        // GenreChartが正しくレンダリングされているか確認
        expect(genreChart).toBeInTheDocument();
        // ジャンルの数が正しいか確認
        expect(within(genreChart).getByTestId('genre-count')).toHaveTextContent('2');
    });
    
    it('does not render GenreDistributionChart when genreCounts is empty', () => {
        // genreCountsが空の場合にPlaylistDetailsコンポーネントをレンダリング
        render(<PlaylistDetails {...defaultProps} genreCounts={{}}/>);
        // GenreChartがレンダリングされていないことを確認
        expect(screen.queryByTestId('genre-chart')).not.toBeInTheDocument();
    });
    
    it('renders RecommendationsTable with correct props', () => {
        // PlaylistDetailsコンポーネントをレンダリング
        render(<PlaylistDetails {...defaultProps} />);
        const recommendationsTable = screen.getByTestId('recommendations-table');
        // RecommendationsTableが正しくレンダリングされているか確認
        expect(recommendationsTable).toBeInTheDocument();
        // 推奨トラックの数が正しいか確認
        expect(within(recommendationsTable).getByTestId('recommendation-count')).toHaveTextContent('1');
        // オーナーIDが正しいか確認
        expect(within(recommendationsTable).getByTestId('owner-id')).toHaveTextContent('owner123');
        // ユーザーIDが正しいか確認
        expect(within(recommendationsTable).getByTestId('user-id')).toHaveTextContent('user123');
        // プレイリストIDが正しいか確認
        expect(within(recommendationsTable).getByTestId('playlist-id')).toHaveTextContent('playlist123');
    });
    
    it('renders correct headings', () => {
        // PlaylistDetailsコンポーネントをレンダリング
        render(<PlaylistDetails {...defaultProps} />);
        // 正しい見出しがレンダリングされているか確認
        expect(screen.getByText('ジャンル分布:')).toBeInTheDocument();
        expect(screen.getByText('おすすめ:')).toBeInTheDocument();
    });
    
    it('handles empty tracks array', () => {
        // トラックが空の場合にPlaylistDetailsコンポーネントをレンダリング
        render(<PlaylistDetails {...defaultProps} tracks={[]}/>);
        const playlistDetailsTable = screen.getByTestId('playlist-details-table');
        // トラックの数が0であることを確認
        expect(within(playlistDetailsTable).getByTestId('track-count')).toHaveTextContent('0');
    });
    
    it('handles empty recommendations array', () => {
        // 推奨トラックが空の場合にPlaylistDetailsコンポーネントをレンダリング
        render(<PlaylistDetails {...defaultProps} recommendations={[]}/>);
        const recommendationsTable = screen.getByTestId('recommendations-table');
        // 推奨トラックの数が0であることを確認
        expect(within(recommendationsTable).getByTestId('recommendation-count')).toHaveTextContent('0');
    });
    
    it('passes accessibility test', async () => {
        // PlaylistDetailsコンポーネントをレンダリング
        const {container} = render(<PlaylistDetails {...defaultProps} />);
        // アクセシビリティテストを実行
        const results = await axe(container);
        // アクセシビリティ違反がないことを確認
        expect(results).toHaveNoViolations();
    });
});
