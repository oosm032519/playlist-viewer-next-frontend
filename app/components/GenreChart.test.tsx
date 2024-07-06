import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import GenreChart, {prepareChartData} from './GenreChart';
import {expect} from '@jest/globals';

// Rechartsのモックを修正
jest.mock('recharts', () => {
    const OriginalModule = jest.requireActual('recharts');
    return {
        ...OriginalModule,
        ResponsiveContainer: ({children}: { children: React.ReactNode }) => <div
            data-testid="responsive-container">{children}</div>,
        PieChart: ({children}: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
        Pie: ({children}: { children: React.ReactNode }) => <div data-testid="pie">{children}</div>,
        Cell: ({fill}: { fill: string }) => <div data-testid="cell" data-fill={fill}>Cell</div>,
        Tooltip: () => <div data-testid="tooltip">Tooltip</div>,
        Legend: () => <div data-testid="legend">Legend</div>,
        // TextとtspanをReactコンポーネントとしてモック
        Text: ({children, ...props}: { children: React.ReactNode, [key: string]: any }) => (
            <p data-testid="text" {...props}>
                {children}
            </p>
        ),
        tspan: ({children, ...props}: { children: React.ReactNode, [key: string]: any }) => (
            <span {...props}>
                {children}
            </span>
        ),
    };
});

const mockGenreCounts = {
    'Rock': 10,
    'Pop': 8,
    'Jazz': 6,
    'Classical': 4,
    'Electronic': 3,
    'Hip Hop': 2,
    'R&B': 2,
    'Country': 1,
    'Blues': 1,
    'Reggae': 1,
};

const mockGenreCountsLessThanNine = {
    'Rock': 10,
    'Pop': 8,
    'Jazz': 6,
};

describe('GenreChart', () => {
    it('renders without crashing and displays the correct playlist name', () => {
        render(<GenreChart genreCounts={mockGenreCounts} playlistName="Test Playlist"/>);
        expect(screen.getByTestId('text')).toHaveTextContent('Test Playlist');
    });
    
    it('handles null playlist name gracefully', () => {
        render(<GenreChart genreCounts={mockGenreCounts} playlistName={null}/>);
        expect(screen.getByTestId('text')).toHaveTextContent('');
    });
    
    it('renders the correct number of Cells for more than 9 genres', () => {
        const {container} = render(<GenreChart genreCounts={mockGenreCounts} playlistName="Test"/>);
        const cells = container.querySelectorAll('[data-testid="cell"]');
        expect(cells).toHaveLength(10); // 9 top genres + 'その他'
    });
    
    it('renders the correct number of Cells for less than 9 genres', () => {
        const {container} = render(<GenreChart genreCounts={mockGenreCountsLessThanNine} playlistName="Test"/>);
        const cells = container.querySelectorAll('[data-testid="cell"]');
        expect(cells).toHaveLength(3);
    });
    
    it('renders Legend and Tooltip components', () => {
        render(<GenreChart genreCounts={mockGenreCounts} playlistName="Test"/>);
        expect(screen.getByTestId('legend')).toBeInTheDocument();
        expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });
    
    it('renders the correct colors for each Cell', () => {
        const {container} = render(<GenreChart genreCounts={mockGenreCounts} playlistName="Test"/>);
        const cells = container.querySelectorAll('[data-testid="cell"]');
        const expectedColors = [
            '#FF8C9E', '#7FD8A6', '#7FBFFF', '#FFE066', '#FFAF7A',
            '#C490D1', '#66E0E0', '#FF9EFF', '#B8D86B', '#FF6B6B'
        ];
        cells.forEach((cell, index) => {
            expect(cell).toHaveAttribute('data-fill', expectedColors[index]);
        });
    });
});

describe('prepareChartData', () => {
    it('correctly prepares chart data for more than 9 genres', () => {
        const total = Object.values(mockGenreCounts).reduce((sum, count) => sum + count, 0);
        const result = prepareChartData(mockGenreCounts, total);
        
        expect(result).toHaveLength(10); // 9 top genres + 'その他'
        expect(result[0]).toEqual({name: 'Rock', value: 10, total});
        expect(result[8]).toEqual({name: 'Blues', value: 1, total});
        expect(result[9]).toEqual({name: 'その他', value: 1, total}); // 'Reggae' is in 'その他'
    });
    
    it('handles less than 9 genres without creating "その他" category', () => {
        const total = Object.values(mockGenreCountsLessThanNine).reduce((sum, count) => sum + count, 0);
        const result = prepareChartData(mockGenreCountsLessThanNine, total);
        
        expect(result).toHaveLength(3);
        expect(result).toEqual([
            {name: 'Rock', value: 10, total},
            {name: 'Pop', value: 8, total},
            {name: 'Jazz', value: 6, total},
        ]);
        expect(result).not.toContainEqual(expect.objectContaining({name: 'その他'}));
    });
});
