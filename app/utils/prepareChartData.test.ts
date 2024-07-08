// app/utils/prepareChartData.test.ts
import prepareChartData from './prepareChartData';
import {expect} from '@jest/globals';

describe('prepareChartData', () => {
    it('should return sorted genres when there are less than 10 genres', () => {
        const genreCounts = {
            'Action': 10,
            'Adventure': 5,
            'Comedy': 7,
        };
        const total = 22;
        
        const result = prepareChartData(genreCounts, total);
        
        expect(result).toEqual([
            {name: 'Action', value: 10, total: 22},
            {name: 'Comedy', value: 7, total: 22},
            {name: 'Adventure', value: 5, total: 22},
        ]);
    });
    
    it('should return top 9 genres and "その他" when there are more than 9 genres', () => {
        const genreCounts = {
            'Action': 10,
            'Adventure': 5,
            'Comedy': 7,
            'Drama': 4,
            'Fantasy': 3,
            'Horror': 2,
            'Mystery': 6,
            'Romance': 8,
            'Sci-Fi': 9,
            'Thriller': 1,
            'Western': 1,
        };
        const total = 56;
        
        const result = prepareChartData(genreCounts, total);
        
        expect(result).toEqual([
            {name: 'Action', value: 10, total: 56},
            {name: 'Sci-Fi', value: 9, total: 56},
            {name: 'Romance', value: 8, total: 56},
            {name: 'Comedy', value: 7, total: 56},
            {name: 'Mystery', value: 6, total: 56},
            {name: 'Adventure', value: 5, total: 56},
            {name: 'Drama', value: 4, total: 56},
            {name: 'Fantasy', value: 3, total: 56},
            {name: 'Horror', value: 2, total: 56},
            {name: 'その他', value: 2, total: 56},
        ]);
    });
    
    it('should handle empty genreCounts', () => {
        const genreCounts = {};
        const total = 0;
        
        const result = prepareChartData(genreCounts, total);
        
        expect(result).toEqual([]);
    });
    
    it('should handle total being zero', () => {
        const genreCounts = {
            'Action': 0,
            'Adventure': 0,
        };
        const total = 0;
        
        const result = prepareChartData(genreCounts, total);
        
        expect(result).toEqual([
            {name: 'Action', value: 0, total: 0},
            {name: 'Adventure', value: 0, total: 0},
        ]);
    });
});
