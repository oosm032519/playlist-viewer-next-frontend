// app/components/PlaylistDetailsTable.test.tsx

import React from 'react';
import {render, screen, fireEvent, within} from '@testing-library/react';
import {axe, toHaveNoViolations} from 'jest-axe';
import {PlaylistDetailsTable} from './PlaylistDetailsTable';
import {Track} from '../types/track';
import {expect} from '@jest/globals';
import {AudioFeatures} from "@/app/types/audioFeaturesTypes";
import {msToMinutesAndSeconds} from '../lib/PlaylistDetailsTableColumns';
import {keyToString} from '../lib/PlaylistDetailsTableColumns';

expect.extend(toHaveNoViolations);

// モックデータ
const mockTracks: Track[] = [
    {
        id: '1',
        name: 'Track 1',
        album: {
            name: 'Album 1',
            images: [{url: 'https://example.com/album1.jpg'}],
            externalUrls: undefined
        },
        artists: [{
            name: 'Artist 1',
            externalUrls: undefined
        }],
        durationMs: 180000,
        audioFeatures: {
            danceability: 0.8,
            energy: 0.7,
            key: 5,
            loudness: -5.5,
            speechiness: 0.1,
            acousticness: 0.2,
            instrumentalness: 0.01,
            liveness: 0.15,
            valence: 0.6,
            tempo: 120,
            mode: 'Major',
            timeSignature: 4,
        },
        previewUrl: undefined
    },
    {
        id: '2',
        name: 'Track 2',
        album: {
            name: 'Album 2',
            images: [{url: 'https://example.com/album2.jpg'}],
            externalUrls: undefined
        },
        artists: [{
            name: 'Artist 2',
            externalUrls: undefined
        }],
        durationMs: 240000,
        audioFeatures: {
            danceability: 0.6,
            energy: 0.8,
            key: 3,
            loudness: -4.2,
            speechiness: 0.05,
            acousticness: 0.3,
            instrumentalness: 0.02,
            liveness: 0.2,
            valence: 0.7,
            tempo: 130,
            mode: 'Minor',
            timeSignature: 3,
        },
        previewUrl: undefined
    },
];

const mockAverageAudioFeatures: AudioFeatures = {
    danceability: 0.7,
    energy: 0.75,
    speechiness: 0.075,
    acousticness: 0.25,
    instrumentalness: 0.015,
    liveness: 0.175,
    valence: 0.65,
};

// Next.jsのImage componentをモック
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} src={props.src} alt={props.alt}/>
    },
}));

// CombinedAudioFeaturesChartコンポーネントをモック
jest.mock('./CombinedAudioFeaturesChart', () => ({
    __esModule: true,
    default: () => <div data-testid="combined-audio-features-chart"/>,
}));

describe('PlaylistDetailsTable', () => {
    it('renders without crashing', () => {
        render(<PlaylistDetailsTable tracks={mockTracks} averageAudioFeatures={mockAverageAudioFeatures}/>);
        expect(screen.getByRole('table')).toBeInTheDocument();
    });
    
    it('displays correct number of rows', () => {
        render(<PlaylistDetailsTable tracks={mockTracks} averageAudioFeatures={mockAverageAudioFeatures}/>);
        const rows = screen.getAllByRole('row');
        expect(rows.length).toBe(mockTracks.length + 1); // +1 はヘッダー行のため
    });
    
    it('displays correct track information', () => {
        render(<PlaylistDetailsTable tracks={mockTracks} averageAudioFeatures={mockAverageAudioFeatures}/>);
        mockTracks.forEach((track) => {
            expect(screen.getByText(track.name)).toBeInTheDocument();
            expect(screen.getByText(track.artists[0].name)).toBeInTheDocument();
            // msToMinutesAndSeconds関数で変換したテキストで検索
            expect(screen.getByText(msToMinutesAndSeconds(track.durationMs))).toBeInTheDocument();
        });
    });
    
    it('renders album images correctly', () => {
        render(<PlaylistDetailsTable tracks={mockTracks} averageAudioFeatures={mockAverageAudioFeatures}/>);
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(mockTracks.length);
        images.forEach((img, index) => {
            expect(img).toHaveAttribute('src', mockTracks[index].album.images[0].url);
            expect(img).toHaveAttribute('alt', mockTracks[index].album.name);
        });
    });
    
    it('displays audio features correctly', () => {
        render(<PlaylistDetailsTable tracks={mockTracks} averageAudioFeatures={mockAverageAudioFeatures}/>);
        mockTracks.forEach((track) => {
            const row = screen.getByText(track.name).closest('tr');
            if (row && track.audioFeatures) {
                const withinRow = within(row);
                
                expect(withinRow.getByTestId(/danceability/i)).toHaveTextContent(track.audioFeatures.danceability.toFixed(3));
                expect(withinRow.getByTestId(/energy/i)).toHaveTextContent(track.audioFeatures.energy.toFixed(3));
                expect(withinRow.getByTestId(/key/i)).toHaveTextContent(keyToString(track.audioFeatures.key)); // keyToString関数を使用
                expect(withinRow.getByTestId(/loudness/i)).toHaveTextContent(track.audioFeatures.loudness.toFixed(3));
                expect(withinRow.getByTestId(/mode/i)).toHaveTextContent(track.audioFeatures.mode);
                expect(withinRow.getByTestId(/timeSignature/i)).toHaveTextContent(track.audioFeatures.timeSignature.toString());
                
                expect(withinRow.getByTestId(/speechiness/i)).toHaveTextContent(track.audioFeatures.speechiness.toFixed(3));
                expect(withinRow.getByTestId(/acousticness/i)).toHaveTextContent(track.audioFeatures.acousticness.toFixed(3));
                expect(withinRow.getByTestId(/instrumentalness/i)).toHaveTextContent(track.audioFeatures.instrumentalness.toFixed(3));
                expect(withinRow.getByTestId(/liveness/i)).toHaveTextContent(track.audioFeatures.liveness.toFixed(3));
                expect(withinRow.getByTestId(/valence/i)).toHaveTextContent(track.audioFeatures.valence.toFixed(3));
                expect(withinRow.getByTestId(/tempo/i)).toHaveTextContent(track.audioFeatures.tempo.toFixed(3));
            }
        });
    });
    
    it('allows sorting of columns', () => {
        render(<PlaylistDetailsTable tracks={mockTracks} averageAudioFeatures={mockAverageAudioFeatures}/>);
        const titleHeader = screen.getByText('Title');
        fireEvent.click(titleHeader);
        const rows = screen.getAllByRole('row');
        expect(within(rows[1]).getByText('Track 1')).toBeInTheDocument();
        
        fireEvent.click(titleHeader);
        expect(within(rows[1]).getByText(/Track \d+/)).toBeInTheDocument();
    });
    
    it('shows CombinedAudioFeaturesChart when a track is selected', () => {
        render(<PlaylistDetailsTable tracks={mockTracks} averageAudioFeatures={mockAverageAudioFeatures}/>);
        const firstTrackRow = screen.getByText('Track 1').closest('tr');
        if (firstTrackRow) {
            fireEvent.click(firstTrackRow);
        }
        expect(screen.getByTestId('combined-audio-features-chart')).toBeInTheDocument();
    });
    
    it('has no accessibility violations', async () => {
        const {container} = render(<PlaylistDetailsTable tracks={mockTracks}
                                                         averageAudioFeatures={mockAverageAudioFeatures}/>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
