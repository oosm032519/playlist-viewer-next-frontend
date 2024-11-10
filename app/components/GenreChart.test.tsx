// GenreChart.test.tsx

import React from 'react';
import {render, screen} from '@testing-library/react';
import GenreChart from '@/app/components/GenreChart';
import {expect} from '@jest/globals';


// Rechartsコンポーネントをモック化
jest.mock('recharts', () => ({
    PieChart: jest.fn(() => <div data-testid="mock-pie-chart"></div>),
    Pie: jest.fn(() => <div data-testid="mock-pie"></div>),
    Cell: jest.fn(() => <div data-testid="mock-cell"></div>),
}));

// uiコンポーネントをモック化
jest.mock('./ui/card', () => ({
    Card: jest.fn(({children}) => <div data-testid="mock-card">{children}</div>),
    CardHeader: jest.fn(({children}) => <div data-testid="mock-card-header">{children}</div>),
    CardTitle: jest.fn(({children}) => <div data-testid="mock-card-title">{children}</div>),
    CardDescription: jest.fn(({children}) => <div data-testid="mock-card-description">{children}</div>),
    CardContent: jest.fn(({children}) => <div data-testid="mock-card-content">{children}</div>),
    CardFooter: jest.fn(({children}) => <div data-testid="mock-card-footer">{children}</div>),
}));
jest.mock('./ui/chart', () => ({
    ChartContainer: jest.fn(({children}) => <div data-testid="mock-chart-container">{children}</div>),
    ChartTooltip: jest.fn(({children}) => <div data-testid="mock-chart-tooltip">{children}</div>),
    ChartConfig: jest.fn(),
}));


describe('GenreChart', () => {
    
    it('ジャンルデータがない場合、正しくレンダリングされる', () => {
        // テストケースの説明: ジャンルデータが空のオブジェクトの場合、コンポーネントがエラーなくレンダリングされ、デフォルトのタイトルと説明が表示されることを確認します。
        render(<GenreChart genreCounts={{}} playlistName={null}/>);
        expect(screen.getByTestId('mock-card-title')).toHaveTextContent('ジャンル分布');
        expect(screen.getByTestId('mock-card-description')).toHaveTextContent('プレイリストのジャンル分布');
        expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();
    });
    
    it('ジャンルデータがある場合、正しくレンダリングされる', () => {
        // テストケースの説明: ジャンルデータが与えられた場合、コンポーネントがエラーなくレンダリングされ、データに基づいて円グラフと凡例が正しく表示されることを確認します。
        const genreCounts = {
            'Rock': 5,
            'Pop': 3,
            'Jazz': 2,
        };
        render(<GenreChart genreCounts={genreCounts} playlistName={'Test Playlist'}/>);
        
        expect(screen.getByTestId('mock-card-title')).toHaveTextContent('Test Playlist');
        expect(screen.getByTestId('mock-card-description')).toHaveTextContent('プレイリストのジャンル分布');
        expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();
        
        // 凡例が表示されていることを確認
        expect(screen.getByText('Rock: 50.0%')).toBeVisible();
        expect(screen.getByText('Pop: 30.0%')).toBeVisible();
        expect(screen.getByText('Jazz: 20.0%')).toBeVisible();
    });
    
    it('ジャンルデータが多い場合、その他としてまとめられる', () => {
        // テストケースの説明: ジャンルデータが5つ以上ある場合、上位4つのジャンルと「その他」に分類され、円グラフと凡例が正しく表示されることを確認します。
        const genreCounts = {
            'Rock': 5,
            'Pop': 3,
            'Jazz': 2,
            'Classical': 1,
            'Electronic': 6,
            'Hip Hop': 4
        };
        render(<GenreChart genreCounts={genreCounts} playlistName={'Test Playlist'}/>);
        
        expect(screen.getByTestId('mock-card-title')).toHaveTextContent('Test Playlist');
        expect(screen.getByTestId('mock-card-description')).toHaveTextContent('プレイリストのジャンル分布');
        expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();
        
        // 凡例が表示されていることを確認 (上位4つとその他)
        expect(screen.getByText('Electronic', {exact: false})).toBeVisible();
        expect(screen.getByText('Rock', {exact: false})).toBeVisible();
        expect(screen.getByText('Hip Hop', {exact: false})).toBeVisible();
        expect(screen.getByText('Pop', {exact: false})).toBeVisible();
        expect(screen.getByText('その他', {exact: false})).toBeVisible();
        
    });
});
