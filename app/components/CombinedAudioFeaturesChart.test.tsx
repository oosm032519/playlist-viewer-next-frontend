// CombinedAudioFeaturesChart.test.tsx

import React from 'react';
import {render, screen} from '@testing-library/react';
import {axe, toHaveNoViolations} from 'jest-axe';
import CombinedAudioFeaturesChart from './CombinedAudioFeaturesChart';
import {AudioFeatures} from '../types/audioFeaturesTypes';
import {expect} from '@jest/globals';
import {Track} from '@/app/types/track'

expect.extend(toHaveNoViolations);

// モックデータの準備
const mockAverageAudioFeatures: AudioFeatures = {
    acousticness: 0.5,
    danceability: 0.6,
    energy: 0.7,
    instrumentalness: 0.1,
    liveness: 0.4,
    speechiness: 0.3,
    valence: 0.8,
};

const mockTrack: Track = {
    id: 'test_id',
    name: 'Test Track',
    previewUrl: 'https://example.com/preview',
    artists: [{
        name: 'Test Artist',
        externalUrls: undefined
    }],
    album: {
        name: 'Test Album',
        images: [{url: 'https://example.com/image.jpg'}],
        externalUrls: undefined
    },
    durationMs: 180000,
    audioFeatures: {
        acousticness: 0.3,
        danceability: 0.8,
        energy: 0.9,
        instrumentalness: 0.1,
        liveness: 0.2,
        speechiness: 0.1,
        valence: 0.7,
        key: 7,
        loudness: -5.5,
        mode: 'minor',
        tempo: 130,
        timeSignature: 4
    },
};

// Rechartsのモックを改善
jest.mock('recharts', () => ({
    ResponsiveContainer: ({children}: { children: React.ReactNode }) => <div
        data-testid="responsive-container">{children}</div>,
    RadarChart: ({children}: { children: React.ReactNode }) => <div data-testid="radar-chart">{children}</div>,
    PolarGrid: () => <div data-testid="polar-grid">PolarGrid</div>,
    PolarAngleAxis: ({dataKey}: { dataKey: string }) => <div data-testid="polar-angle-axis">{dataKey}</div>,
    PolarRadiusAxis: () => <div data-testid="polar-radius-axis">PolarRadiusAxis</div>,
    Radar: ({name, dataKey}: { name: string; dataKey: string }) => <div data-testid={`radar-${dataKey}`}>{name}</div>,
    Legend: () => <div data-testid="legend">Legend</div>,
}));

describe('CombinedAudioFeaturesChart', () => {
    it('renders without crashing', () => {
        render(<CombinedAudioFeaturesChart averageAudioFeatures={mockAverageAudioFeatures}/>);
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
        expect(screen.getByTestId('polar-grid')).toBeInTheDocument();
        expect(screen.getByTestId('polar-angle-axis')).toBeInTheDocument();
        expect(screen.getByTestId('polar-radius-axis')).toBeInTheDocument();
        expect(screen.getByTestId('radar-value')).toBeInTheDocument();
        expect(screen.getByTestId('legend')).toBeInTheDocument();
    });
    
    it('renders both average and track data when track is provided', () => {
        render(<CombinedAudioFeaturesChart averageAudioFeatures={mockAverageAudioFeatures} track={mockTrack}/>);
        expect(screen.getByTestId('radar-value')).toHaveTextContent('平均 Audio Features');
        expect(screen.getByTestId('radar-trackValue')).toHaveTextContent('Test Track の Audio Features');
    });
    
    it('renders only average data when track is not provided', () => {
        render(<CombinedAudioFeaturesChart averageAudioFeatures={mockAverageAudioFeatures}/>);
        expect(screen.getByTestId('radar-value')).toHaveTextContent('平均 Audio Features');
        expect(screen.queryByTestId('radar-trackValue')).not.toBeInTheDocument();
    });
});

describe('Accessibility', () => {
    it('should not have any accessibility violations', async () => {
        const {container} = render(
            <CombinedAudioFeaturesChart averageAudioFeatures={mockAverageAudioFeatures} track={mockTrack}/>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});

describe('Data processing', () => {
    it('correctly processes average audio features', () => {
        render(<CombinedAudioFeaturesChart averageAudioFeatures={mockAverageAudioFeatures}/>);
        expect(screen.getByTestId('polar-angle-axis')).toHaveTextContent('feature');
    });
    
    it('correctly processes track audio features when provided', () => {
        render(<CombinedAudioFeaturesChart averageAudioFeatures={mockAverageAudioFeatures} track={mockTrack}/>);
        expect(screen.getByTestId('radar-trackValue')).toBeInTheDocument();
    });
});
