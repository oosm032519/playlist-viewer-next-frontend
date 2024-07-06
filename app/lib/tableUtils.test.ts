// tableUtils.test.ts

import {audioFeatureSort} from './tableUtils';
import {expect} from '@jest/globals';

describe('audioFeatureSort', () => {
    const createMockTrack = (value: number | undefined) => ({
        original: {
            audioFeatures: {
                testFeature: value,
            },
        },
    });
    
    it('正しく昇順でソートされること', () => {
        const a = createMockTrack(0.5);
        const b = createMockTrack(0.7);
        expect(audioFeatureSort(a, b, 'testFeature')).toBeLessThan(0);
        expect(audioFeatureSort(b, a, 'testFeature')).toBeGreaterThan(0);
    });
    
    it('同じ値の場合は0を返すこと', () => {
        const a = createMockTrack(0.5);
        const b = createMockTrack(0.5);
        expect(audioFeatureSort(a, b, 'testFeature')).toBe(0);
    });
    
    it('undefined値は常に後ろにソートされること', () => {
        const a = createMockTrack(0.5);
        const b = createMockTrack(undefined);
        expect(audioFeatureSort(a, b, 'testFeature')).toBeLessThan(0);
        expect(audioFeatureSort(b, a, 'testFeature')).toBeGreaterThan(0);
    });
    
    it('両方がundefinedの場合は0を返すこと', () => {
        const a = createMockTrack(undefined);
        const b = createMockTrack(undefined);
        expect(audioFeatureSort(a, b, 'testFeature')).toBe(0);
    });
    
    it('存在しないaccessorKeyの場合は両方undefinedとして扱われること', () => {
        const a = createMockTrack(0.5);
        const b = createMockTrack(0.7);
        expect(audioFeatureSort(a, b, 'nonExistentFeature')).toBe(0);
    });
    
    it('小数点以下の値も正しくソートされること', () => {
        const a = createMockTrack(0.123);
        const b = createMockTrack(0.124);
        expect(audioFeatureSort(a, b, 'testFeature')).toBeLessThan(0);
    });
    
    it('負の値も正しくソートされること', () => {
        const a = createMockTrack(-0.5);
        const b = createMockTrack(0.5);
        expect(audioFeatureSort(a, b, 'testFeature')).toBeLessThan(0);
    });
    
    it('大きな値と小さな値の差も正しくソートされること', () => {
        const a = createMockTrack(1000000);
        const b = createMockTrack(-1000000);
        expect(audioFeatureSort(a, b, 'testFeature')).toBeGreaterThan(0);
    });
    
    it('0と他の値の比較が正しく行われること', () => {
        const zero = createMockTrack(0);
        const positive = createMockTrack(0.1);
        const negative = createMockTrack(-0.1);
        expect(audioFeatureSort(zero, positive, 'testFeature')).toBeLessThan(0);
        expect(audioFeatureSort(zero, negative, 'testFeature')).toBeGreaterThan(0);
    });
});
