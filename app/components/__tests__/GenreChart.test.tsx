// GenreChart.test.tsx

import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import GenreChart from '../GenreChart';
import {prepareChartData} from '../GenreChart';

// recharts のモックを修正
jest.mock('recharts', () => ({
    ResponsiveContainer: ({children}: { children: React.ReactNode }) => <div
        data-testid="responsive-container">{children}</div>,
    PieChart: ({children}: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
    Pie: ({children}: { children: React.ReactNode }) => <div data-testid="pie">{children}</div>,
    Cell: () => <div data-testid="cell">Cell</div>,
    Tooltip: () => <div data-testid="tooltip">Tooltip</div>,
    Legend: () => <div data-testid="legend">Legend</div>,
    Text: ({children}: { children: React.ReactNode }) => <div data-testid="text">{children}</div>,
}));

describe('GenreChart', () => {
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
    
    it('renders without crashing', () => {
        render(<GenreChart genreCounts={mockGenreCounts} playlistName="Test Playlist"/>);
        expect(screen.getByTestId('text')).toHaveTextContent('Test Playlist');
    });
    
    it('displays the correct playlist name', () => {
        render(<GenreChart genreCounts={mockGenreCounts} playlistName="My Favorite Songs"/>);
        expect(screen.getByTestId('text')).toHaveTextContent('My Favorite Songs');
    });
    
    it('renders with null playlist name', () => {
        render(<GenreChart genreCounts={mockGenreCounts} playlistName={null}/>);
        expect(screen.getByTestId('text')).toHaveTextContent('');
    });
    
    it('renders the correct number of Cells', () => {
        const {container} = render(<GenreChart genreCounts={mockGenreCounts} playlistName="Test"/>);
        const cells = container.querySelectorAll('[data-testid="cell"]');
        // 10個のジャンル（9個のトップジャンル + その他）に対応するCellが存在するはず
        expect(cells).toHaveLength(10);
    });
    
    it('renders Legend component', () => {
        render(<GenreChart genreCounts={mockGenreCounts} playlistName="Test"/>);
        expect(screen.getByTestId('legend')).toBeInTheDocument();
    });
    
    it('renders Tooltip component', () => {
        render(<GenreChart genreCounts={mockGenreCounts} playlistName="Test"/>);
        expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });
    
    describe('prepareChartData', () => {
        it('correctly prepares chart data for more than 9 genres', () => {
            const genreCounts = {
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
            const total = Object.values(genreCounts).reduce((sum, count) => sum + count, 0);
            const result = prepareChartData(genreCounts, total);
            
            expect(result).toHaveLength(10); // 9 top genres + 'その他'
            expect(result[0]).toEqual({name: 'Rock', value: 10, total});
            expect(result[8]).toEqual({name: 'Blues', value: 1, total});
            expect(result[9]).toEqual({name: 'その他', value: 1, total}); // 'Reggae' is in 'その他'
        });
        
        it('handles less than 9 genres without creating "その他" category', () => {
            const genreCounts = {
                'Rock': 10,
                'Pop': 8,
                'Jazz': 6,
            };
            const total = Object.values(genreCounts).reduce((sum, count) => sum + count, 0);
            const result = prepareChartData(genreCounts, total);
            
            expect(result).toHaveLength(3);
            expect(result).toEqual([
                {name: 'Rock', value: 10, total},
                {name: 'Pop', value: 8, total},
                {name: 'Jazz', value: 6, total},
            ]);
            expect(result).not.toContainEqual(expect.objectContaining({name: 'その他'}));
        });
    });
})
