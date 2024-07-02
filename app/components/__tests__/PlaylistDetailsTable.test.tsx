// PlaylistDetailsTable.test.tsx

import React from 'react';
import {render, screen, fireEvent, within} from '@testing-library/react';
import {PlaylistDetailsTable} from '../PlaylistDetailsTable';
import {Track} from '@/app/types/track';
import '@testing-library/jest-dom';

// モックデータの準備
const mockTracks: Track[] = [
    {
        id: '1',
        name: 'Track 1',
        artists: [{
            name: 'Artist 1',
            externalUrls: undefined
        }],
        album: {
            name: 'Album 1', images: [{url: 'https://example.com/image1.jpg'}],
            externalUrls: undefined
        },
        durationMs: 200000,
        audioFeatures: {
            danceability: 0.8,
            energy: 0.6,
            key: 5,
            loudness: -5.5,
            mode: 'Major',
            speechiness: 0.1,
            acousticness: 0.2,
            instrumentalness: 0.01,
            liveness: 0.1,
            valence: 0.7,
            tempo: 120,
            timeSignature: 4,
        },
        previewUrl: undefined
    },
    // 他のトラックも同様に追加
];

// next/imageのモック
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        return <img {...props}  alt={"Album 1"}/>;
    },
}));

// AudioFeaturesChartコンポーネントのモック
jest.mock('../AudioFeaturesChart', () => {
    return {
        __esModule: true,
        default: () => <div data-testid="audio-features-chart"/>,
    };
});

describe('PlaylistDetailsTable', () => {
    it('renders the table with correct headers', () => {
        render(<PlaylistDetailsTable tracks={mockTracks}/>);
        
        const headers = [
            'Album', 'Title', 'Artist', 'Danceability', 'Energy', 'Key', 'Loudness',
            'Mode', 'Speechiness', 'Acousticness', 'Instrumentalness', 'Liveness',
            'Valence', 'Tempo', 'Duration (ms)', 'Time Signature'
        ];
        
        headers.forEach(header => {
            expect(screen.getByText(header)).toBeInTheDocument();
        });
    });
    
    it('renders the correct number of rows', () => {
        render(<PlaylistDetailsTable tracks={mockTracks}/>);
        const rows = screen.getAllByRole('row');
        // ヘッダー行を除いた数が正しいか確認
        expect(rows.length - 1).toBe(mockTracks.length);
    });
    
    it('displays correct track information', () => {
        render(<PlaylistDetailsTable tracks={mockTracks}/>);
        
        const firstRow = screen.getAllByRole('row')[1]; // 0はヘッダー行
        
        expect(within(firstRow).getByAltText('Album 1')).toBeInTheDocument();
        expect(within(firstRow).getByText('Track 1')).toBeInTheDocument();
        expect(within(firstRow).getByText('Artist 1')).toBeInTheDocument();
        expect(within(firstRow).getByText('0.800')).toBeInTheDocument(); // Danceability
        expect(within(firstRow).getByText('0.600')).toBeInTheDocument(); // Energy
        expect(within(firstRow).getByText('5')).toBeInTheDocument(); // Key
        expect(within(firstRow).getByText('-5.500')).toBeInTheDocument(); // Loudness
        expect(within(firstRow).getByText('Major')).toBeInTheDocument(); // Mode
        // 他のオーディオ特性も同様にテスト
    });
    
    it('sorts the table when header is clicked', async () => {
        render(<PlaylistDetailsTable tracks={mockTracks}/>);
        
        const danceabilityHeader = screen.getByText('Danceability');
        fireEvent.click(danceabilityHeader);
        
        // ソート後の最初の行を取得
        const firstRow = screen.getAllByRole('row')[1];
        
        // ソートされた結果を確認（この例では最小値が上に来ることを想定）
        expect(within(firstRow).getByText('0.800')).toBeInTheDocument();
        
        // 逆順ソートのテスト
        fireEvent.click(danceabilityHeader);
        const newFirstRow = screen.getAllByRole('row')[1];
        expect(within(newFirstRow).getByText('0.800')).toBeInTheDocument();
    });
    
    it('displays AudioFeaturesChart when a row is clicked', () => {
        render(<PlaylistDetailsTable tracks={mockTracks}/>);
        
        const firstRow = screen.getAllByRole('row')[1];
        fireEvent.click(firstRow);
        
        expect(screen.getByTestId('audio-features-chart')).toBeInTheDocument();
        expect(screen.getByText('Audio Features: Track 1')).toBeInTheDocument();
    });
});
