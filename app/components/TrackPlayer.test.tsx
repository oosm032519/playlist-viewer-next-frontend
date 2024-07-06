// app/components/TrackPlayer.test.tsx

import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {TrackPlayer} from './TrackPlayer';
import {expect} from '@jest/globals';
import {Track} from '../types/track'

const mockTrack: Track = {
    id: '1',
    name: 'Test Track 1',
    album: {
        name: 'Test Album 1',
        images: [{url: 'https://example.com/image1.jpg'}],
        externalUrls: {spotify: 'https://open.spotify.com/album/1'}
    },
    artists: [{
        name: 'Test Artist 1',
        externalUrls: {spotify: 'https://open.spotify.com/artist/1'}
    }],
    previewUrl: 'https://example.com/preview1.mp3',
    durationMs: 180000,
};

describe('TrackPlayer', () => {
    it('renders play button when previewUrl is available', () => {
        render(<TrackPlayer track={mockTrack}/>);
        expect(screen.getByText('試聴する')).toBeInTheDocument();
    });
    
    it('does not render play button when previewUrl is not available', () => {
        const trackWithoutPreview = {...mockTrack, previewUrl: undefined};
        render(<TrackPlayer track={trackWithoutPreview}/>);
        expect(screen.queryByText('試聴する')).not.toBeInTheDocument();
    });
    
    it('toggles between play and stop when button is clicked', () => {
        render(<TrackPlayer track={mockTrack}/>);
        const button = screen.getByText('試聴する');
        fireEvent.click(button);
        expect(button).toHaveTextContent('停止');
        fireEvent.click(button);
        expect(button).toHaveTextContent('試聴する');
    });
});
