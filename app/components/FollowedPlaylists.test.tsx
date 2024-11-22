// app/components/FollowedPlaylists.test.tsx

import {render, screen, waitFor} from '@testing-library/react';
import FollowedPlaylists from '@/app/components/FollowedPlaylists';
import {useQuery} from '@tanstack/react-query';
import {Playlist} from '@/app/types/playlist';
import {expect} from '@jest/globals';

// useQueryのモック
jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
}));

// DOMPurify.sanitize のモック
jest.mock('dompurify', () => ({
    sanitize: jest.fn((value) => value),
}));

describe('FollowedPlaylists', () => {
    const mockPlaylists: Playlist[] = [
        {
            id: '1',
            name: 'Playlist 1',
            ownerName: '',
            totalDuration: 0,
            minAudioFeatures: {
                acousticness: 0,
                danceability: 0,
                energy: 0,
                instrumentalness: 0,
                liveness: 0,
                speechiness: 0,
                valence: 0,
            },
            maxAudioFeatures: {
                acousticness: 0,
                danceability: 0,
                energy: 0,
                instrumentalness: 0,
                liveness: 0,
                speechiness: 0,
                valence: 0,
            },
            averageAudioFeatures: {
                acousticness: 0,
                danceability: 0,
                energy: 0,
                instrumentalness: 0,
                liveness: 0,
                speechiness: 0,
                valence: 0,
            },
            seedArtists: [],
            ownerId: '',
            tracks: {items: []},
            images: [{url: '/image1.jpg', height: 300, width: 300}],
            genreCounts: {},
            externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/playlist/1'}}
        },
        {
            id: '2',
            name: 'Playlist 2',
            ownerName: '',
            totalDuration: 0,
            minAudioFeatures: {
                acousticness: 0,
                danceability: 0,
                energy: 0,
                instrumentalness: 0,
                liveness: 0,
                speechiness: 0,
                valence: 0,
            },
            maxAudioFeatures: {
                acousticness: 0,
                danceability: 0,
                energy: 0,
                instrumentalness: 0,
                liveness: 0,
                speechiness: 0,
                valence: 0,
            },
            averageAudioFeatures: {
                acousticness: 0,
                danceability: 0,
                energy: 0,
                instrumentalness: 0,
                liveness: 0,
                speechiness: 0,
                valence: 0,
            },
            seedArtists: [],
            ownerId: '',
            tracks: {items: []},
            images: [],
            genreCounts: {},
            externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/playlist/2'}}
        },
    ];
    
    const mockOnPlaylistClick = jest.fn();
    
    it('プレイリストが正しく表示される', async () => {
        // useQueryのモックを設定し、プレイリストデータを返す
        (useQuery as jest.Mock).mockReturnValue({
            data: mockPlaylists,
            isLoading: false,
            error: undefined,
        });
        
        // コンポーネントをレンダリング
        render(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        
        // プレイリスト名が表示されていることを確認
        await waitFor(() => {
            expect(screen.getByText('Playlist 1')).toBeInTheDocument();
            expect(screen.getByText('Playlist 2')).toBeInTheDocument();
        });
        
        // 画像が表示されているか確認
        await waitFor(() => {
            const imgElement = screen.getByRole('img', {name: 'Playlist 1'});
            expect(imgElement).toHaveAttribute('src');
            expect(imgElement.getAttribute('src')).toContain('/image1.jpg');
        });
        
        // 画像がないプレイリストのプレースホルダーが表示されているか確認
        await waitFor(() => {
            expect(screen.getByText('No Image')).toBeInTheDocument();
        });
    });
    
    it('ロード中にローディングスピナーが表示される', () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: true,
            error: undefined,
        });
        
        render(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        
        // ローディングスピナーが表示されていることを確認
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
    
    it('エラー発生時にエラーメッセージが表示される', () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
            error: new Error('エラーメッセージ'),
        });
        
        render(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        
        // エラーメッセージが表示されていることを確認
        expect(screen.getByRole('alert')).toHaveTextContent('Error');
        expect(screen.getByRole('alert')).toHaveTextContent('エラーメッセージ');
    });
    
    it('フォロー中のプレイリストがない場合、メッセージが表示される', () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: [],
            isLoading: false,
            error: undefined,
        });
        
        render(<FollowedPlaylists onPlaylistClick={mockOnPlaylistClick}/>);
        
        // メッセージが表示されていることを確認
        expect(screen.getByText('フォロー中のプレイリストはありません。')).toBeInTheDocument();
    });
});
