// app/lib/PlaylistDetailsTableColumns.test.tsx

import React from 'react';
import {render, screen} from '@testing-library/react';
import {toHaveNoViolations} from 'jest-axe';
import {playlistDetailsTableColumns, keyToString, msToMinutesAndSeconds} from './PlaylistDetailsTableColumns';
import {Track} from '../types/track';
import {expect} from '@jest/globals';
import {CellContext} from '@tanstack/react-table';

expect.extend(toHaveNoViolations);

const mockTrack: Track = {
    id: '1',
    name: 'Test Track',
    artists: [{name: 'Test Artist', externalUrls: {}}],
    album: {
        name: 'Test Album',
        images: [{url: 'https://example.com/image.jpg'}],
        externalUrls: {},
    },
    durationMs: 180000,
    previewUrl: 'https://example.com/preview.mp3',
    audioFeatures: {
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
        mode: 'Major',
        timeSignature: 4,
    },
};

describe('PlaylistDetailsTableColumns', () => {
    test('keyToString converts key number to string correctly', () => {
        expect(keyToString(0)).toBe('C');
        expect(keyToString(5)).toBe('F');
        expect(keyToString(11)).toBe('B');
        expect(keyToString(undefined)).toBe('-');
    });
    
    test('msToMinutesAndSeconds converts milliseconds to minutes and seconds', () => {
        expect(msToMinutesAndSeconds(180000)).toBe('3:00');
        expect(msToMinutesAndSeconds(63000)).toBe('1:03');
        expect(msToMinutesAndSeconds(undefined)).toBe('-');
    });
    
    test('playlistDetailsTableColumns contains correct number of columns', () => {
        expect(playlistDetailsTableColumns.length).toBe(16);
    });
    
    test('Album column renders image correctly', () => {
        const AlbumCell = playlistDetailsTableColumns[0].cell as (props: CellContext<Track, any>) => React.ReactNode;
        render(<>{AlbumCell({
            getValue: () => mockTrack.album,
            row: {original: mockTrack}
        } as CellContext<Track, any>)}</>);
        const img = screen.getByAltText('Test Album');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', expect.stringContaining('image.jpg'));
    });
    
    test('Title column accessor is correct', () => {
        expect(playlistDetailsTableColumns[1].header).toBe('Title');
        expect('accessorKey' in playlistDetailsTableColumns[1] && playlistDetailsTableColumns[1].accessorKey).toBe('name');
    });
    
    test('Artist column renders artist name correctly', () => {
        const ArtistCell = playlistDetailsTableColumns[2].cell as (props: CellContext<Track, any>) => React.ReactNode;
        render(<>{ArtistCell({
            getValue: () => mockTrack.artists,
            row: {original: mockTrack}
        } as CellContext<Track, any>)}</>);
        expect(screen.getByText('Test Artist')).toBeInTheDocument();
    });
    
    test('Danceability column renders value correctly', () => {
        const DanceabilityCell = playlistDetailsTableColumns[3].cell as (props: CellContext<Track, any>) => React.ReactNode;
        render(<>{DanceabilityCell({
            getValue: () => mockTrack.audioFeatures?.danceability,
            row: {original: mockTrack}
        } as CellContext<Track, any>)}</>);
        expect(screen.getByText('0.800')).toBeInTheDocument();
    });
    
    test('Mode column renders value correctly', () => {
        const ModeCell = playlistDetailsTableColumns[13].cell as (props: CellContext<Track, any>) => React.ReactNode;
        render(<>{ModeCell({
            getValue: () => mockTrack.audioFeatures?.mode,
            row: {original: mockTrack}
        } as CellContext<Track, any>)}</>);
        expect(screen.getByText('Major')).toBeInTheDocument();
    });
    
    test('Duration column renders formatted time correctly', () => {
        const DurationCell = playlistDetailsTableColumns[14].cell as (props: CellContext<Track, any>) => React.ReactNode;
        render(<>{DurationCell({
            getValue: () => mockTrack.durationMs,
            row: {original: mockTrack}
        } as CellContext<Track, any>)}</>);
        expect(screen.getByText('3:00')).toBeInTheDocument();
    });
    
    test('Energy column renders value correctly', () => {
        const EnergyCell = playlistDetailsTableColumns[4].cell as (props: CellContext<Track, any>) => React.ReactNode;
        render(<>{EnergyCell({
            getValue: () => mockTrack.audioFeatures?.energy,
            row: {original: mockTrack}
        } as CellContext<Track, any>)}</>);
        expect(screen.getByText('0.900')).toBeInTheDocument();
    });
    
    test('Tempo column renders value correctly', () => {
        const TempoCell = playlistDetailsTableColumns[12].cell as (props: CellContext<Track, any>) => React.ReactNode;
        render(<>{TempoCell({
            getValue: () => mockTrack.audioFeatures?.tempo,
            row: {original: mockTrack}
        } as CellContext<Track, any>)}</>);
        expect(screen.getByText('120.000')).toBeInTheDocument();
    });
});
