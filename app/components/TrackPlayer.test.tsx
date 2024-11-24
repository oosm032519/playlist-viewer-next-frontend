// app/components/TrackPlayer.test.tsx

import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {TrackPlayer} from '@/app/components/TrackPlayer';
import {expect} from '@jest/globals';
import {Track} from '@/app/types/track'

// モック用のトラックデータを定義
const mockTrack: Track = {
    id: '1',
    name: 'Test Track 1',
    album: {
        name: 'Test Album 1',
        images: [{url: 'https://example.com/image1.jpg'}],
        externalUrls: {
            externalUrls: {spotify: 'https://open.spotify.com/album/1'}
        }
    },
    artists: [{
        name: 'Test Artist 1',
        externalUrls: {
            externalUrls: {
                spotify: 'https://open.spotify.com/artist/1'
            }
        }
    }],
    previewUrl: 'https://example.com/preview1.mp3',
    durationMs: 180000,
    externalUrls: {
        externalUrls: {
            spotify: 'https://open.spotify.com/track/1'
        }
    },
    audioFeatures: null
};

// TrackPlayerコンポーネントのテストスイート
describe('TrackPlayer', () => {
    // previewUrlが存在する場合、再生ボタンが表示されることをテスト
    it('renders play button when previewUrl is available', () => {
        render(<TrackPlayer track={mockTrack}/>);
        expect(screen.getByText('試聴する')).toBeInTheDocument();
    });
    
    // previewUrlが存在しない場合、再生ボタンが表示されないことをテスト
    it('does not render play button when previewUrl is not available', () => {
        const trackWithoutPreview = {...mockTrack, previewUrl: null};
        render(<TrackPlayer track={trackWithoutPreview}/>);
        expect(screen.queryByText('試聴する')).not.toBeInTheDocument();
    });
    
    // 再生ボタンがクリックされたときに、再生と停止がトグルされることをテスト
    it('toggles between play and stop when button is clicked', () => {
        render(<TrackPlayer track={mockTrack}/>);
        const button = screen.getByText('試聴する');
        fireEvent.click(button);
        expect(button).toHaveTextContent('停止');
        fireEvent.click(button);
        expect(button).toHaveTextContent('試聴する');
    });
});
