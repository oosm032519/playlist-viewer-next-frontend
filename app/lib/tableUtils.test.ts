// tableUtils.test.ts

import {Row} from '@tanstack/react-table';
import {Track} from '../types/track';
import {audioFeatureSort} from './tableUtils';
import {expect} from '@jest/globals';

describe('audioFeatureSort', () => {
    const createMockRow = (audioFeatures: Partial<Track['audioFeatures']>): Row<Track> => ({
        original: {audioFeatures} as Track,
    } as Row<Track>);
    
    it('数値の場合、正しくソートされること', () => {
        const rowA = createMockRow({danceability: 0.5});
        const rowB = createMockRow({danceability: 0.7});
        
        expect(audioFeatureSort(rowA, rowB, 'danceability')).toBeLessThan(0);
        expect(audioFeatureSort(rowB, rowA, 'danceability')).toBeGreaterThan(0);
    });
    
    it('文字列の場合、正しくソートされること', () => {
        const rowA = createMockRow({mode: 'major'});
        const rowB = createMockRow({mode: 'minor'});
        
        expect(audioFeatureSort(rowA, rowB, 'mode')).toBeLessThan(0);
        expect(audioFeatureSort(rowB, rowA, 'mode')).toBeGreaterThan(0);
    });
    
    it('undefined の場合、正しく処理されること', () => {
        const rowA = createMockRow({});
        const rowB = createMockRow({danceability: 0.5});
        
        expect(audioFeatureSort(rowA, rowB, 'danceability')).toBeGreaterThan(0);
        expect(audioFeatureSort(rowB, rowA, 'danceability')).toBeLessThan(0);
    });
    
    it('両方 undefined の場合、0 を返すこと', () => {
        const rowA = createMockRow({});
        const rowB = createMockRow({});
        
        expect(audioFeatureSort(rowA, rowB, 'danceability')).toBe(0);
    });
    
    it('サポートされていない型の場合、0 を返すこと', () => {
        const rowA = createMockRow({unsupportedFeature: true} as any);
        const rowB = createMockRow({unsupportedFeature: false} as any);
        
        expect(audioFeatureSort(rowA, rowB, 'unsupportedFeature' as any)).toBe(0);
    });
});
