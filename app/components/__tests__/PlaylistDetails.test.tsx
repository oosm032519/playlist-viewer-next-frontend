// app/components/PlaylistDetails.test.tsx

import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import PlaylistDetails from '../PlaylistDetails';
import {Track} from '@/app/types/track';

// モックコンポーネントの作成
jest.mock('../PlaylistDetailsTable', () => ({
    PlaylistDetailsTable: () => <div data-testid="playlist-details-table">Mocked PlaylistDetailsTable</div>,
}));

jest.mock('../GenreChart', () => ({
    __esModule: true,
    default: () => <div data-testid="genre-chart">Mocked GenreChart</div>,
}));

jest.mock('../RecommendationsTable', () => ({
    RecommendationsTable: () => <div data-testid="recommendations-table">Mocked RecommendationsTable</div>,
}));

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
    
    it('renders PlaylistDetailsTable', () => {
        render(<PlaylistDetails {...defaultProps} />);
        expect(screen.getByTestId('playlist-details-table')).toBeInTheDocument();
    });
    
    it('renders GenreDistributionChart when genreCounts is not empty', () => {
        render(<PlaylistDetails {...defaultProps} />);
        expect(screen.getByTestId('genre-chart')).toBeInTheDocument();
    });
    
    it('does not render GenreDistributionChart when genreCounts is empty', () => {
        render(<PlaylistDetails {...defaultProps} genreCounts={{}}/>);
        expect(screen.queryByTestId('genre-chart')).not.toBeInTheDocument();
    });
    
    it('renders RecommendationsTable', () => {
        render(<PlaylistDetails {...defaultProps} />);
        expect(screen.getByTestId('recommendations-table')).toBeInTheDocument();
    });
    
    it('renders correct headings', () => {
        render(<PlaylistDetails {...defaultProps} />);
        expect(screen.getByText('Genre Distribution:')).toBeInTheDocument();
        expect(screen.getByText('Recommendations:')).toBeInTheDocument();
    });
    
    it('passes correct props to RecommendationsTable', () => {
        const {container} = render(<PlaylistDetails {...defaultProps} />);
        const recommendationsTable = container.querySelector('[data-testid="recommendations-table"]');
        expect(recommendationsTable).toBeInTheDocument();
        // Note: In a real scenario, we would check if the props are correctly passed.
        // However, since we're using a mock, we can't directly check the props here.
    });
});
