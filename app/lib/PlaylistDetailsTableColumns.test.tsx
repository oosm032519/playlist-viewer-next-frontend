// app/lib/PlaylistDetailsTableColumns.test.tsx

import React from 'react';
import {render, screen, within} from '@testing-library/react';
import {toHaveNoViolations} from 'jest-axe';
import {playlistDetailsTableColumns, keyToString, msToMinutesAndSeconds} from '@/app/lib/PlaylistDetailsTableColumns';
import {Track} from '@/app/types/track';
import {expect} from '@jest/globals';
import {CellContext} from '@tanstack/react-table';

expect.extend(toHaveNoViolations);

const mockTrack: Track = {
    externalUrls: {externalUrls: {spotify: ''}},
    id: '1',
    name: 'Test Track',
    artists: [{name: 'Test Artist', externalUrls: {
        externalUrls: {spotify: 'https://example.com/artist'}
        }}],
    album: {
        name: 'Test Album',
        images: [{url: 'https://example.com/image.jpg'}],
        externalUrls: {
            externalUrls: {spotify: 'https://example.com/album'},
        },
    },
    durationMs: 180000,
    previewUrl: 'https://example.com/preview.mp3',
    audioFeatures: {
        durationMs: 180000,
        danceability: 0.8,
        energy: 0.9,
        key: 5,
        loudness: -5.5,
        speechiness: 0.1,
        acousticness: 0.2,
        instrumentalness: 0.01,
        liveness: 0.1,
        valence: 0.7,
        tempo: 120,
        mode: 'MAJOR',
        timeSignature: 4,
        id: 'mock-id',
    }
};

describe('PlaylistDetailsTableColumns', () => {
    test('keyToString converts key number to string correctly', () => {
        expect(keyToString(0)).toBe('C');
        expect(keyToString(5)).toBe('F');
        expect(keyToString(11)).toBe('B');
        expect(keyToString(undefined)).toBe('-');
        expect(keyToString(12)).toBe('-');
    });
    
    test('msToMinutesAndSeconds converts milliseconds to minutes and seconds', () => {
        expect(msToMinutesAndSeconds(180000)).toBe('3:00');
        expect(msToMinutesAndSeconds(63000)).toBe('1:03');
        expect(msToMinutesAndSeconds(3000)).toBe('0:03');
        expect(msToMinutesAndSeconds(undefined)).toBe('-');
    });
    
    test('playlistDetailsTableColumns contains correct number of columns', () => {
        expect(playlistDetailsTableColumns.length).toBe(16);
    });
    
    test('Title column accessor is correct', () => {
        expect(playlistDetailsTableColumns[1].header).toBe('Title');
        expect('accessorKey' in playlistDetailsTableColumns[1] && playlistDetailsTableColumns[1].accessorKey).toBe('name');
    });
    
    test('Artist column renders artist name correctly', () => {
        const ArtistCell = playlistDetailsTableColumns[2].cell as (props: CellContext<Track, any>) => React.ReactNode;
        render(<div data-testid="artist-cell">{ArtistCell({
            getValue: () => mockTrack.artists,
            row: {original: mockTrack}
        } as CellContext<Track, any>)}</div>);
        const cell = screen.getByTestId('artist-cell');
        expect(within(cell).getByText('Test Artist')).toBeInTheDocument();
    });
    
    const testAudioFeatureCell = (index: number, featureName: string, expectedValue: string) => {
        test(`${featureName} column renders value correctly`, () => {
            const Cell = playlistDetailsTableColumns[index].cell as (props: CellContext<Track, any>) => React.ReactNode;
            render(<div data-testid={`${featureName.toLowerCase()}-cell`}>{Cell({
                getValue: () => mockTrack.audioFeatures?.[featureName.toLowerCase() as keyof typeof mockTrack.audioFeatures],
                row: {original: mockTrack}
            } as CellContext<Track, any>)}</div>);
            const cell = screen.getByTestId(`${featureName.toLowerCase()}-cell`);
            expect(within(cell).getByText(expectedValue)).toBeInTheDocument();
        });
    };
    
    testAudioFeatureCell(3, 'Danceability', '0.800');
    testAudioFeatureCell(4, 'Energy', '0.900');
    testAudioFeatureCell(5, 'Key', 'F');
    testAudioFeatureCell(6, 'Loudness', '-5.500');
    testAudioFeatureCell(7, 'Speechiness', '0.100');
    testAudioFeatureCell(8, 'Acousticness', '0.200');
    testAudioFeatureCell(9, 'Instrumentalness', '0.010');
    testAudioFeatureCell(10, 'Liveness', '0.100');
    testAudioFeatureCell(11, 'Valence', '0.700');
    testAudioFeatureCell(12, 'Tempo', '120.000');
    
    test('Mode column renders value correctly', () => {
        const ModeCell = playlistDetailsTableColumns[13].cell as (props: CellContext<Track, any>) => React.ReactNode;
        render(<div data-testid="mode-cell">{ModeCell({
            getValue: () => mockTrack.audioFeatures?.mode,
            row: {original: mockTrack}
        } as CellContext<Track, any>)}</div>);
        const cell = screen.getByTestId('mode-cell');
        expect(within(cell).getByText('Major')).toBeInTheDocument();
    });
    
    test('Duration column renders formatted time correctly', () => {
        const DurationCell = playlistDetailsTableColumns[14].cell as (props: CellContext<Track, any>) => React.ReactNode;
        render(<div data-testid="duration-cell">{DurationCell({
            getValue: () => mockTrack.durationMs,
            row: {original: mockTrack}
        } as CellContext<Track, any>)}</div>);
        const cell = screen.getByTestId('duration-cell');
        expect(within(cell).getByText('3:00')).toBeInTheDocument();
    });
    
    test('Time Signature column renders value correctly', () => {
        const TimeSignatureCell = playlistDetailsTableColumns[15].cell as (props: CellContext<Track, any>) => React.ReactNode;
        render(<div data-testid="time-signature-cell">{TimeSignatureCell({
            getValue: () => mockTrack.audioFeatures?.timeSignature,
            row: {original: mockTrack}
        } as CellContext<Track, any>)}</div>);
        const cell = screen.getByTestId('time-signature-cell');
        expect(within(cell).getByText('4')).toBeInTheDocument();
    });
    
    test('Columns render "-" when audio features are undefined', () => {
        const mockTrackWithoutAudioFeatures: Track = {
            ...mockTrack,
            audioFeatures: null
        };
        
        const audioFeatureColumns = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15];
        audioFeatureColumns.forEach(index => {
            const Cell = playlistDetailsTableColumns[index].cell as (props: CellContext<Track, any>) => React.ReactNode;
            const featureName = playlistDetailsTableColumns[index].header?.toString().toLowerCase();
            render(<div data-testid={`${featureName}-cell`}>{Cell({
                getValue: () => undefined,
                row: {original: mockTrackWithoutAudioFeatures}
            } as CellContext<Track, any>)}</div>);
            const cell = screen.getByTestId(`${featureName}-cell`);
            expect(within(cell).getByText('-')).toBeInTheDocument();
        });
    });
    
    test('Album column sorting is disabled', () => {
        expect(playlistDetailsTableColumns[0].enableSorting).toBe(false);
    });
    
    test('Audio feature columns have correct sorting function', () => {
        const audioFeatureColumns = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        audioFeatureColumns.forEach(index => {
            expect(playlistDetailsTableColumns[index].sortingFn).toBeDefined();
        });
    });
    
    test('Mode column has correct sorting function', () => {
        expect(playlistDetailsTableColumns[13].sortingFn).toBeDefined();
    });
    
    test('Duration column has correct sorting function', () => {
        expect(playlistDetailsTableColumns[14].sortingFn).toBeDefined();
    });
    
    test('Time Signature column has correct sorting function', () => {
        expect(playlistDetailsTableColumns[15].sortingFn).toBeDefined();
    });
    
    test('All columns have correct headers', () => {
        const expectedHeaders = [
            'Album', 'Title', 'Artist', 'Danceability', 'Energy', 'Key', 'Loudness',
            'Speechiness', 'Acousticness', 'Instrumentalness', 'Liveness', 'Valence',
            'Tempo', 'Mode', 'Duration', 'Time Signature'
        ];
        playlistDetailsTableColumns.forEach((column, index) => {
            expect(column.header).toBe(expectedHeaders[index]);
        });
    });
});
