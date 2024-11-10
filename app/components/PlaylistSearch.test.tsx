// app/components/PlaylistSearch.test.tsx

import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {axe, toHaveNoViolations} from 'jest-axe';
import {QueryClient, QueryClientProvider, useQuery} from '@tanstack/react-query';
import PlaylistSearch from '@/app/components/PlaylistSearch';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

// @tanstack/react-queryのモックを設定
jest.mock('@tanstack/react-query', () => ({
    ...jest.requireActual('@tanstack/react-query'),
    useQuery: jest.fn(),
}));

// useQueryをモック関数としてキャスト
const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;

// モックデータの定義
const mockPlaylists = [
    {
        id: '1',
        name: 'Test Playlist 1',
        description: 'Test Description 1',
        images: [{url: 'https://example.com/image1.jpg'}],
    },
    {
        id: '2',
        name: 'Test Playlist 2',
        description: 'Test Description 2',
        images: [{url: 'https://example.com/image2.jpg'}],
    },
];

// QueryClientProviderでラップしてコンポーネントをレンダリングする関数
const renderWithQueryClient = (component: React.ReactElement) => {
    const queryClient = new QueryClient();
    return render(
        <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
    );
};

// PlaylistSearchコンポーネントのテストスイート
describe('PlaylistSearch', () => {
    // 各テストの前にモックの初期化
    beforeEach(() => {
        mockUseQuery.mockReturnValue({
            data: [],
            isLoading: false,
            refetch: jest.fn(),
        } as any);
    });
    
    // コンポーネントがクラッシュせずにレンダリングされるかのテスト
    it('renders without crashing', () => {
        renderWithQueryClient(<PlaylistSearch/>);
        expect(screen.getByText('Playlist Search')).toBeInTheDocument();
    });
    
    // 入力フィールドと検索ボタンが表示されるかのテスト
    it('displays an input field and a search button', () => {
        renderWithQueryClient(<PlaylistSearch/>);
        expect(screen.getByPlaceholderText('Enter playlist name')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Search'})).toBeInTheDocument();
    });
    
    // 短いクエリに対するバリデーションエラーの表示テスト
    it('shows validation error for short query', async () => {
        renderWithQueryClient(<PlaylistSearch/>);
        const input = screen.getByPlaceholderText('Enter playlist name');
        const searchButton = screen.getByRole('button', {name: 'Search'});
        
        await userEvent.type(input, 'a');
        await userEvent.click(searchButton);
        
        await waitFor(() => {
            expect(screen.getByText('最低2文字以上入力してください')).toBeInTheDocument();
        });
    });
    
    // 有効なクエリでフォームを送信した際の検索実行テスト
    it('performs search when form is submitted with valid query', async () => {
        const mockRefetch = jest.fn();
        mockUseQuery.mockReturnValue({
            data: mockPlaylists,
            isLoading: false,
            refetch: mockRefetch,
        } as any);
        
        renderWithQueryClient(<PlaylistSearch/>);
        const input = screen.getByPlaceholderText('Enter playlist name');
        const searchButton = screen.getByRole('button', {name: 'Search'});
        
        await userEvent.type(input, 'test query');
        await userEvent.click(searchButton);
        
        await waitFor(() => {
            expect(mockRefetch).toHaveBeenCalled();
        });
    });
    
    // データが利用可能な場合の検索結果表示テスト
    it('displays search results when data is available', async () => {
        mockUseQuery.mockReturnValue({
            data: mockPlaylists,
            isLoading: false,
            refetch: jest.fn(),
        } as any);
        
        renderWithQueryClient(<PlaylistSearch/>);
        
        await waitFor(() => {
            expect(screen.getByText('Test Playlist 1')).toBeInTheDocument();
            expect(screen.getByText('Test Playlist 2')).toBeInTheDocument();
        });
    });
    
    // アクセシビリティ違反がないかのテスト
    it('has no accessibility violations', async () => {
        const {container} = renderWithQueryClient(<PlaylistSearch/>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
