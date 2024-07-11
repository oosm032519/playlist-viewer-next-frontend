// app/components/AudioFeaturesChart.test.tsx

import '@testing-library/jest-dom';
import React from 'react';
import {render, screen} from '@testing-library/react';
import AudioFeaturesChart from './AudioFeaturesChart';
import {Track} from '../types/track';
import {axe, toHaveNoViolations} from 'jest-axe';
import {expect, it} from '@jest/globals';

expect.extend(toHaveNoViolations);

// モックデータを定義
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
    /**
     * @description チャートと必要なコンポーネントをすべてレンダリングするテスト
     */
    it('チャートと必要なコンポーネントをすべてレンダリングする', () => {
        render(<AudioFeaturesChart track={mockTrack}/>);
        
        // 各コンポーネントが正しくレンダリングされているかを確認
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
        expect(screen.getByTestId('polar-grid')).toBeInTheDocument();
        expect(screen.getByTestId('polar-angle-axis')).toBeInTheDocument();
        expect(screen.getByTestId('polar-radius-axis')).toBeInTheDocument();
        expect(screen.getByTestId('radar')).toBeInTheDocument();
    });
    
    /**
     * @description undefined の audioFeatures を適切に処理するテスト
     */
    it('undefined の audioFeatures を適切に処理する', () => {
        const trackWithoutAudioFeatures: Track = {...mockTrack, audioFeatures: undefined};
        render(<AudioFeaturesChart track={trackWithoutAudioFeatures}/>);
        
        // audioFeaturesがundefinedでもコンポーネントが正しくレンダリングされるかを確認
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
    });
    
    /**
     * @description Radar コンポーネントに正しいデータを渡すテスト
     */
    it('Radar コンポーネントに正しいデータを渡す', () => {
        render(<AudioFeaturesChart track={mockTrack}/>);
        
        // Radarコンポーネントに正しいdataKeyが渡されているかを確認
        const radarElement = screen.getByTestId('radar');
        expect(radarElement).toHaveAttribute('data-datakey', 'value');
    });
    
    /**
     * @description 部分的な audioFeatures データを処理するテスト
     */
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
        
        // 部分的なaudioFeaturesでもコンポーネントが正しくレンダリングされるかを確認
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('radar')).toBeInTheDocument();
    });
    
    /**
     * @description アクセシビリティに問題がないことを確認するテスト
     */
    it('アクセシビリティに問題がない', async () => {
        const {container} = render(<AudioFeaturesChart track={mockTrack}/>);
        const results = await axe(container);
        
        // アクセシビリティの違反がないことを確認
        expect(results).toHaveNoViolations();
    });
});
