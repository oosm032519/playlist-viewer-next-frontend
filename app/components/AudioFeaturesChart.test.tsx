import '@testing-library/jest-dom';
import React from 'react';
import {render, screen} from '@testing-library/react';
import AudioFeaturesChart from './AudioFeaturesChart';
import {Track} from '../types/track';
import {axe, toHaveNoViolations} from 'jest-axe';
import {expect, it} from '@jest/globals';

expect.extend(toHaveNoViolations);

// モックデータ
const mockTrack: Track = {
    id: '1',
    name: 'Test Track',
    artists: [{name: 'Test Artist', externalUrls: undefined}],
    album: {
        name: 'Test Album',
        images: [{url: 'test-image-url'}],
        externalUrls: undefined,
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
    durationMs: 0,
};

// Rechartsコンポーネントをモック
jest.mock('recharts', () => ({
    ResponsiveContainer: ({children}: { children: React.ReactNode }) => (
        <div data-testid="responsive-container">{children}</div>
    ),
    RadarChart: ({children}: { children: React.ReactNode }) => (
        <div data-testid="radar-chart">{children}</div>
    ),
    PolarGrid: () => <div data-testid="polar-grid"/>,
    PolarAngleAxis: () => <div data-testid="polar-angle-axis"/>,
    PolarRadiusAxis: () => <div data-testid="polar-radius-axis"/>,
    Radar: ({dataKey}: { dataKey: string }) => (
        <div data-testid="radar" data-datakey={dataKey}/>
    ),
}));

describe('AudioFeaturesChart', () => {
    it('チャートと必要なコンポーネントをすべてレンダリングする', () => {
        render(<AudioFeaturesChart track={mockTrack}/>);
        
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
        expect(screen.getByTestId('polar-grid')).toBeInTheDocument();
        expect(screen.getByTestId('polar-angle-axis')).toBeInTheDocument();
        expect(screen.getByTestId('polar-radius-axis')).toBeInTheDocument();
        expect(screen.getByTestId('radar')).toBeInTheDocument();
    });
    
    it('undefined の audioFeatures を適切に処理する', () => {
        const trackWithoutAudioFeatures: Track = {...mockTrack, audioFeatures: undefined};
        render(<AudioFeaturesChart track={trackWithoutAudioFeatures}/>);
        
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
    });
    
    it('Radar コンポーネントに正しいデータを渡す', () => {
        render(<AudioFeaturesChart track={mockTrack}/>);
        
        const radarElement = screen.getByTestId('radar');
        expect(radarElement).toHaveAttribute('data-datakey', 'value');
    });
    
    it('部分的な audioFeatures データを処理する', () => {
        const partialAudioFeatures: Partial<Track['audioFeatures']> = {
            danceability: 0.8,
            energy: 0.6,
        };
        const trackWithPartialAudioFeatures: Track = {
            ...mockTrack,
            audioFeatures: partialAudioFeatures as Track['audioFeatures'],
        };
        render(<AudioFeaturesChart track={trackWithPartialAudioFeatures}/>);
        
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('radar')).toBeInTheDocument();
    });
    
    it('スナップショットと一致する', () => {
        const {container} = render(<AudioFeaturesChart track={mockTrack}/>);
        expect(container).toMatchSnapshot();
    });
    
    it('アクセシビリティに問題がない', async () => {
        const {container} = render(<AudioFeaturesChart track={mockTrack}/>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
