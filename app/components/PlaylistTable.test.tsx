// app/components/PlaylistTable.test.tsx

import {render, screen, fireEvent} from '@testing-library/react';
import PlaylistTable from '@/app/components/PlaylistTable';
import {Playlist} from "@/app/types/playlist";
import '@testing-library/jest-dom';
import {expect} from "@jest/globals";

// Imageコンポーネントをモック
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} src={props.src} alt={props.alt}/>
    },
}));

// Mock Data
const playlists: Playlist[] = [
    {
        tracks: {total: 0},
        id: '1',
        name: 'Playlist 1',
        description: 'Description 1',
        images: [{url: '/images/image1.jpg'}], // パスを修正
        externalUrls: {externalUrls: {spotify: 'spotify1'}}
    },
    {
        tracks: {total: 0},
        id: '2',
        name: 'Playlist 2',
        description: 'Description 2',
        images: [{url: '/images/image2.jpg'}], // パスを修正
        externalUrls: {externalUrls: {spotify: 'spotify2'}}
    },
];

const onPlaylistClick = jest.fn();

describe('PlaylistTable', () => {
    beforeEach(() => {
        // 各テスト前にモックをリセット
        jest.clearAllMocks();
    });
    
    it('renders without crashing', () => {
        render(
            <PlaylistTable
                playlists={[]}
                onPlaylistClick={onPlaylistClick}
                currentPage={1}
                totalPlaylists={0}
            />
        );
    });
    
    it('renders playlist data correctly', () => {
        render(
            <PlaylistTable
                playlists={playlists}
                onPlaylistClick={onPlaylistClick}
                currentPage={1}
                totalPlaylists={2}
            />
        );
        
        // プレイリスト名の表示確認
        expect(screen.getByText('Playlist 1')).toBeInTheDocument();
        expect(screen.getByText('Playlist 2')).toBeInTheDocument();
        
        // プレイリスト画像の表示確認
        expect(screen.getByRole('img', {name: 'Playlist 1'})).toHaveAttribute('src', '/images/image1.jpg');
        expect(screen.getByRole('img', {name: 'Playlist 2'})).toHaveAttribute('src', '/images/image2.jpg');
        
        // トラック数の表示確認
        const trackCounts = screen.getAllByText('0');
        expect(trackCounts).toHaveLength(2);
        
        // 総プレイリスト数の表示確認
        expect(screen.getByText('検索結果: 2件')).toBeInTheDocument();
    });
    
    it('calls onPlaylistClick when a row is clicked', () => {
        render(
            <PlaylistTable
                playlists={playlists}
                onPlaylistClick={onPlaylistClick}
                currentPage={1}
                totalPlaylists={2}
            />
        );
        
        fireEvent.click(screen.getByText('Playlist 1'));
        expect(onPlaylistClick).toHaveBeenCalledWith('1');
    });
    
    it('renders image placeholder when image url is not available', () => {
        const playlistsWithoutImage = playlists.map(playlist => ({
            ...playlist,
            images: []
        }));
        
        render(
            <PlaylistTable
                playlists={playlistsWithoutImage}
                onPlaylistClick={onPlaylistClick}
                currentPage={1}
                totalPlaylists={2}
            />
        );
        
        const placeholders = screen.getAllByTestId('image-placeholder');
        expect(placeholders).toHaveLength(2);
    });
});
