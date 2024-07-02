// PlaylistDetailsTable.test.tsx

import React from 'react';
import {render, screen, fireEvent, within, act} from '@testing-library/react';
import {PlaylistDetailsTable} from './PlaylistDetailsTable';
import {Track} from '@/app/types/track';
import '@testing-library/jest-dom';
import {axe, toHaveNoViolations} from 'jest-axe';

expect.extend(toHaveNoViolations);

// モックデータの準備
const mockTracks: Track[] = [
    {
        id: '1',
        name: 'Bohemian Rhapsody',
        artists: [{
            name: 'Queen',
            externalUrls: undefined
        }],
        album: {
            name: 'A Night at the Opera', images: [{url: 'https://example.com/queen_anato.jpg'}],
            externalUrls: undefined
        },
        durationMs: 354320,
        audioFeatures: {
            danceability: 0.414,
            energy: 0.737,
            key: 0,
            loudness: -9.928,
            mode: 'Minor',
            speechiness: 0.0583,
            acousticness: 0.0204,
            instrumentalness: 0.000203,
            liveness: 0.248,
            valence: 0.228,
            tempo: 143.883,
            timeSignature: 4,
        },
        previewUrl: undefined
    },
    {
        id: '2',
        name: 'Billie Jean',
        artists: [{
            name: 'Michael Jackson',
            externalUrls: undefined
        }],
        album: {
            name: 'Thriller', images: [{url: 'https://example.com/mj_thriller.jpg'}],
            externalUrls: undefined
        },
        durationMs: 293827,
        audioFeatures: {
            danceability: 0.878,
            energy: 0.696,
            key: 6,
            loudness: -3.252,
            mode: 'Major',
            speechiness: 0.0284,
            acousticness: 0.0152,
            instrumentalness: 0.0117,
            liveness: 0.0812,
            valence: 0.818,
            tempo: 116.982,
            timeSignature: 4,
        },
        previewUrl: undefined
    },
    {
        id: '3',
        name: 'Imagine',
        artists: [{
            name: 'John Lennon',
            externalUrls: undefined
        }],
        album: {
            name: 'Imagine', images: [{url: 'https://example.com/lennon_imagine.jpg'}],
            externalUrls: undefined
        },
        durationMs: 183000,
        audioFeatures: {
            danceability: 0.535,
            energy: 0.205,
            key: 7,
            loudness: -12.726,
            mode: 'Major',
            speechiness: 0.0293,
            acousticness: 0.883,
            instrumentalness: 0.000166,
            liveness: 0.0957,
            valence: 0.324,
            tempo: 75.13,
            timeSignature: 4,
        },
        previewUrl: undefined
    },
    {
        id: '4',
        name: 'Smells Like Teen Spirit',
        artists: [{
            name: 'Nirvana',
            externalUrls: undefined
        }],
        album: {
            name: 'Nevermind', images: [{url: 'https://example.com/nirvana_nevermind.jpg'}],
            externalUrls: undefined
        },
        durationMs: 301920,
        audioFeatures: {
            danceability: 0.502,
            energy: 0.912,
            key: 1,
            loudness: -5.698,
            mode: 'Minor',
            speechiness: 0.0498,
            acousticness: 0.00015,
            instrumentalness: 0.0000829,
            liveness: 0.0486,
            valence: 0.714,
            tempo: 116.761,
            timeSignature: 4,
        },
        previewUrl: undefined
    },
    {
        id: '5',
        name: 'Take Five',
        artists: [{
            name: 'Dave Brubeck',
            externalUrls: undefined
        }],
        album: {
            name: 'Time Out', images: [{url: 'https://example.com/brubeck_timeout.jpg'}],
            externalUrls: undefined
        },
        durationMs: 324000,
        audioFeatures: {
            danceability: 0.474,
            energy: 0.358,
            key: 4,
            loudness: -13.261,
            mode: 'Minor',
            speechiness: 0.0366,
            acousticness: 0.675,
            instrumentalness: 0.897,
            liveness: 0.0863,
            valence: 0.327,
            tempo: 172.079,
            timeSignature: 5,
        },
        previewUrl: undefined
    },
];

// 空のトラックリストのモックデータ
const emptyTracks: Track[] = [];

// next/imageのモック
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        return <img {...props} alt={props.alt || ''}/>;
    },
}));

// AudioFeaturesChartコンポーネントのモック
jest.mock('./AudioFeaturesChart', () => {
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
        
        const albumImage = within(firstRow).getByRole('img');
        expect(albumImage).toHaveAttribute('src', 'https://example.com/queen_anato.jpg');
        expect(albumImage).toHaveAttribute('alt', 'A Night at the Opera');
        expect(within(firstRow).getByText('Bohemian Rhapsody')).toBeInTheDocument();
        expect(within(firstRow).getByText('Queen')).toBeInTheDocument();
        expect(within(firstRow).getByText('0.414')).toBeInTheDocument(); // Danceability
        expect(within(firstRow).getByText('0.737')).toBeInTheDocument(); // Energy
        expect(within(firstRow).getByText('0')).toBeInTheDocument(); // Key
        expect(within(firstRow).getByText('-9.928')).toBeInTheDocument(); // Loudness
        expect(within(firstRow).getByText('Minor')).toBeInTheDocument(); // Mode
        expect(within(firstRow).getByText('143.883')).toBeInTheDocument(); // Tempo
        expect(within(firstRow).getByText('354320')).toBeInTheDocument(); // Duration
        expect(within(firstRow).getByText('4')).toBeInTheDocument(); // Time Signature
    });
    
    it('sorts the table when header is clicked', async () => {
        render(<PlaylistDetailsTable tracks={mockTracks}/>);
        
        const danceabilityHeader = screen.getByText('Danceability');
        fireEvent.click(danceabilityHeader);
        
        // ソート後の最初の行を取得
        const firstRow = screen.getAllByRole('row')[1];
        
        // Bohemian Rhapsodyが最も低いdanceabilityを持つので、最初に来るはず
        expect(within(firstRow).getByText('Bohemian Rhapsody')).toBeInTheDocument();
        
        // 逆順ソートのテスト
        fireEvent.click(danceabilityHeader);
        const newFirstRow = screen.getAllByRole('row')[1];
        // Billie Jeanが最も高いdanceabilityを持つので、最初に来るはず
        expect(within(newFirstRow).getByText('Billie Jean')).toBeInTheDocument();
    });
    
    it('displays AudioFeaturesChart when a row is clicked', () => {
        render(<PlaylistDetailsTable tracks={mockTracks}/>);
        
        const firstRow = screen.getAllByRole('row')[1];
        fireEvent.click(firstRow);
        
        expect(screen.getByTestId('audio-features-chart')).toBeInTheDocument();
        expect(screen.getByText('Audio Features: Bohemian Rhapsody')).toBeInTheDocument();
    });
    
    it('handles tracks with different time signatures', () => {
        render(<PlaylistDetailsTable tracks={mockTracks}/>);
        
        const lastRow = screen.getAllByRole('row')[mockTracks.length];
        expect(within(lastRow).getByText('Take Five')).toBeInTheDocument();
        expect(within(lastRow).getByText('5')).toBeInTheDocument(); // Time Signature
    });
    
    // 新しいテスト
    it('renders empty state when no tracks are provided', () => {
        render(<PlaylistDetailsTable tracks={emptyTracks}/>);
        expect(screen.getByText('No tracks available')).toBeInTheDocument();
    });
    
    it('handles sorting for all columns', () => {
        render(<PlaylistDetailsTable tracks={mockTracks}/>);
        const headers = screen.getAllByRole('columnheader');
        
        headers.forEach((header) => {
            if (header.textContent !== 'Album') { // Album列はソート不可
                fireEvent.click(header);
                // ソートが適用されたことを確認（詳細な検証は省略）
                expect(header).toHaveAttribute('aria-sort');
            }
        });
    });
    
    it('maintains selected track when sorting', () => {
        render(<PlaylistDetailsTable tracks={mockTracks}/>);
        
        // 最初の行を選択
        const firstRow = screen.getAllByRole('row')[1];
        fireEvent.click(firstRow);
        expect(screen.getByText('Audio Features: Bohemian Rhapsody')).toBeInTheDocument();
        
        // ソートを実行
        const danceabilityHeader = screen.getByText('Danceability');
        fireEvent.click(danceabilityHeader);
        
        // 選択状態が維持されていることを確認
        expect(screen.getByText('Audio Features: Bohemian Rhapsody')).toBeInTheDocument();
    });
    
    it('handles tracks with missing audio features', () => {
        const tracksWithMissingFeatures = [
            {
                ...mockTracks[0],
                audioFeatures: undefined
            },
            ...mockTracks.slice(1)
        ];
        
        render(<PlaylistDetailsTable tracks={tracksWithMissingFeatures}/>);
        
        const firstRow = screen.getAllByRole('row')[1];
        expect(within(firstRow).getAllByText('-').length).toBeGreaterThan(0);
    });
    
    it('is accessible', async () => {
        const {container} = render(<PlaylistDetailsTable tracks={mockTracks}/>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    it('handles rapid sorting interactions', async () => {
        render(<PlaylistDetailsTable tracks={mockTracks}/>);
        const danceabilityHeader = screen.getByText('Danceability');
        
        await act(async () => {
            for (let i = 0; i < 10; i++) {
                fireEvent.click(danceabilityHeader);
            }
        });
        
        // テーブルが正しく描画されていることを確認
        expect(screen.getAllByRole('row').length).toBe(mockTracks.length + 1); // ヘッダー行 + データ行
    });
    
    it('is accessible', async () => {
        const {container} = render(<PlaylistDetailsTable tracks={mockTracks}/>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
