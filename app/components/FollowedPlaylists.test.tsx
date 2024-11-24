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
            id: 'playlist1',
            name: 'Playlist 1',
            images: [{url: 'https://example.com/image1.jpg'}],
            tracks: {total: 10},
            externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/playlist/playlist1'}},
            owner: {displayName: 'Test User 1'},
        },
        {
            id: 'playlist2',
            name: 'Playlist 2',
            images: [],
            tracks: {total: 5},
            externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/playlist/playlist2'}},
            owner: {displayName: 'Test User 2'},
        },
        {
            id: 'playlist3',
            name: 'Playlist 3',
            images: [{url: 'https://example.com/image3.jpg'}],
            tracks: {total: 20},
            externalUrls: {externalUrls: {spotify: 'https://open.spotify.com/playlist/playlist3'}},
            owner: {displayName: 'Test User 3'},
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
            // Next.js Image Optimization APIによって生成されたURLに元の画像URLの一部が含まれていることを確認
            expect(imgElement.getAttribute('src')).toContain('https%3A%2F%2Fexample.com%2Fimage1.jpg');
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
