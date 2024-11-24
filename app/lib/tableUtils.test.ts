// app/lib/tableUtils.test.ts

import {Row} from '@tanstack/react-table';
import {Track} from '@/app/types/track';
import {audioFeatureSort} from '@/app/lib/tableUtils';
import {expect} from '@jest/globals';

describe('audioFeatureSort', () => {
    /**
     * モックのRowオブジェクトを作成するヘルパー関数
     * @param {Partial<Track['audioFeatures']>} audioFeatures - トラックのオーディオフィーチャーの部分的なオブジェクト
     * @returns {Row<Track>} - モックのRowオブジェクト
     */
    const createMockRow = (audioFeatures: Partial<Track['audioFeatures']>): Row<Track> => ({
        original: {audioFeatures} as Track,
    } as Row<Track>);
    
    it('数値の場合、正しくソートされること', () => {
        // danceabilityが0.5のRowオブジェクトを作成
        const rowA = createMockRow({danceability: 0.5});
        // danceabilityが0.7のRowオブジェクトを作成
        const rowB = createMockRow({danceability: 0.7});
        
        // rowAがrowBより小さいことを確認
        expect(audioFeatureSort(rowA, rowB, 'danceability')).toBeLessThan(0);
        // rowBがrowAより大きいことを確認
        expect(audioFeatureSort(rowB, rowA, 'danceability')).toBeGreaterThan(0);
    });
    
    it('文字列の場合、正しくソートされること', () => {
        // modeが'major'のRowオブジェクトを作成
        const rowA = createMockRow({mode: 'MAJOR'});
        // modeが'minor'のRowオブジェクトを作成
        const rowB = createMockRow({mode: 'MINOR'});
        
        // rowAがrowBより小さいことを確認
        expect(audioFeatureSort(rowA, rowB, 'mode')).toBeLessThan(0);
        // rowBがrowAより大きいことを確認
        expect(audioFeatureSort(rowB, rowA, 'mode')).toBeGreaterThan(0);
    });
    
    it('undefined の場合、正しく処理されること', () => {
        // audioFeaturesが空のRowオブジェクトを作成
        const rowA = createMockRow({});
        // danceabilityが0.5のRowオブジェクトを作成
        const rowB = createMockRow({danceability: 0.5});
        
        // rowAがrowBより大きいことを確認
        expect(audioFeatureSort(rowA, rowB, 'danceability')).toBeGreaterThan(0);
        // rowBがrowAより小さいことを確認
        expect(audioFeatureSort(rowB, rowA, 'danceability')).toBeLessThan(0);
    });
    
    it('両方 undefined の場合、0 を返すこと', () => {
        // audioFeaturesが空のRowオブジェクトを2つ作成
        const rowA = createMockRow({});
        const rowB = createMockRow({});
        
        // 両方ともundefinedの場合、0を返すことを確認
        expect(audioFeatureSort(rowA, rowB, 'danceability')).toBe(0);
    });
    
    it('サポートされていない型の場合、0 を返すこと', () => {
        // サポートされていないフィーチャーを持つRowオブジェクトを2つ作成
        const rowA = createMockRow({unsupportedFeature: true} as any);
        const rowB = createMockRow({unsupportedFeature: false} as any);
        
        // サポートされていないフィーチャーの場合、0を返すことを確認
        expect(audioFeatureSort(rowA, rowB, 'unsupportedFeature' as any)).toBe(0);
    });
});
