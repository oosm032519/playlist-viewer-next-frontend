// app/components/PlaylistDetails.test.tsx

import React from 'react';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {axe, toHaveNoViolations} from 'jest-axe';
import '@testing-library/jest-dom';
import PlaylistDetails from './PlaylistDetails';
import {Track} from '@/app/types/track';
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

expect.extend(toHaveNoViolations);

describe('PlaylistDetails', () => {
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
    
    const defaultProps = {
        tracks: mockTracks,
        genreCounts: mockGenreCounts,
        recommendations: mockRecommendations,
        playlistName: 'Test Playlist',
        ownerId: 'owner123',
        userId: 'user123',
        playlistId: 'playlist123',
    };
    
    it('renders PlaylistDetailsTable with correct number of tracks', () => {
        render(<PlaylistDetails {...defaultProps} />);
        const playlistDetailsTable = screen.getByTestId('playlist-details-table');
        expect(playlistDetailsTable).toBeInTheDocument();
        expect(within(playlistDetailsTable).getByTestId('track-count')).toHaveTextContent('1');
    });
    
    it('renders GenreDistributionChart when genreCounts is not empty', () => {
        render(<PlaylistDetails {...defaultProps} />);
        const genreChart = screen.getByTestId('genre-chart');
        expect(genreChart).toBeInTheDocument();
        expect(within(genreChart).getByTestId('genre-count')).toHaveTextContent('2');
    });
    
    it('does not render GenreDistributionChart when genreCounts is empty', () => {
        render(<PlaylistDetails {...defaultProps} genreCounts={{}}/>);
        expect(screen.queryByTestId('genre-chart')).not.toBeInTheDocument();
    });
    
    it('renders RecommendationsTable with correct props', () => {
        render(<PlaylistDetails {...defaultProps} />);
        const recommendationsTable = screen.getByTestId('recommendations-table');
        expect(recommendationsTable).toBeInTheDocument();
        expect(within(recommendationsTable).getByTestId('recommendation-count')).toHaveTextContent('1');
        expect(within(recommendationsTable).getByTestId('owner-id')).toHaveTextContent('owner123');
        expect(within(recommendationsTable).getByTestId('user-id')).toHaveTextContent('user123');
        expect(within(recommendationsTable).getByTestId('playlist-id')).toHaveTextContent('playlist123');
    });
    
    it('renders correct headings', () => {
        render(<PlaylistDetails {...defaultProps} />);
        expect(screen.getByText('Genre Distribution:')).toBeInTheDocument();
        expect(screen.getByText('Recommendations:')).toBeInTheDocument();
    });
    
    it('handles empty tracks array', () => {
        render(<PlaylistDetails {...defaultProps} tracks={[]}/>);
        const playlistDetailsTable = screen.getByTestId('playlist-details-table');
        expect(within(playlistDetailsTable).getByTestId('track-count')).toHaveTextContent('0');
    });
    
    it('handles empty recommendations array', () => {
        render(<PlaylistDetails {...defaultProps} recommendations={[]}/>);
        const recommendationsTable = screen.getByTestId('recommendations-table');
        expect(within(recommendationsTable).getByTestId('recommendation-count')).toHaveTextContent('0');
    });
    
    it('passes accessibility test', async () => {
        const {container} = render(<PlaylistDetails {...defaultProps} />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
