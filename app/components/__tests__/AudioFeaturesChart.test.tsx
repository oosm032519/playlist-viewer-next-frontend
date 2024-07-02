import React from 'react';
import {render, screen} from '@testing-library/react';
import AudioFeaturesChart from '../AudioFeaturesChart';
import {Track} from '@/app/types/track';

// モックデータを修正
const mockTrack: Track = {
    id: '1',
    name: 'Test Track',
    artists: [{
        name: 'Test Artist',
        externalUrls: undefined
    }],
    album: {
        name: 'Test Album', images: [{url: 'test-image-url'}],
        externalUrls: undefined
    },
    audioFeatures: {
        danceability: 0.8,
        energy: 0.6,
        key: 5,
        loudness: -5.5,
        mode: 'major',
        speechiness: 0.1,
        acousticness: 0.2,
        instrumentalness: 0.01,
        liveness: 0.3,
        valence: 0.7,
        tempo: 120,
        timeSignature: 4,
    },
    previewUrl: undefined,
    durationMs: 0
};

// Rechartsコンポーネントをモック（変更なし）
jest.mock('recharts', () => ({
    ResponsiveContainer: ({children}: { children: React.ReactNode }) => <div
        data-testid="responsive-container">{children}</div>,
    RadarChart: ({children}: { children: React.ReactNode }) => <div data-testid="radar-chart">{children}</div>,
    PolarGrid: () => <div data-testid="polar-grid"/>,
    PolarAngleAxis: () => <div data-testid="polar-angle-axis"/>,
    PolarRadiusAxis: () => <div data-testid="polar-radius-axis"/>,
    Radar: () => <div data-testid="radar"/>,
}));

describe('AudioFeaturesChart', () => {
    it('renders the chart with all necessary components', () => {
        render(<AudioFeaturesChart track={mockTrack}/>);
        
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
        expect(screen.getByTestId('polar-grid')).toBeInTheDocument();
        expect(screen.getByTestId('polar-angle-axis')).toBeInTheDocument();
        expect(screen.getByTestId('polar-radius-axis')).toBeInTheDocument();
        expect(screen.getByTestId('radar')).toBeInTheDocument();
    });
    
    it('handles undefined audioFeatures gracefully', () => {
        const trackWithoutAudioFeatures: Track = {...mockTrack, audioFeatures: undefined};
        render(<AudioFeaturesChart track={trackWithoutAudioFeatures}/>);
        
        // チャートは空のデータでレンダリングされるはずですが、エラーは発生しないはずです
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });
});