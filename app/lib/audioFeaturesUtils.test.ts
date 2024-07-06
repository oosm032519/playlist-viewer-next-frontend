import {prepareAudioFeaturesData} from './audioFeaturesUtils';
import {Track} from '../types/track';
import {expect, it} from '@jest/globals';

describe('prepareAudioFeaturesData', () => {
    const mockAudioFeatures: Track['audioFeatures'] = {
        danceability: 0.8,
        energy: 0.6,
        key: 5,
        loudness: -5.5,
        mode: 'major',
        speechiness: 0.1,
        acousticness: 0.2,
        instrumentalness: 0.01,
        liveness: 0.3,
        valence: 0.7,
        tempo: 120,
        timeSignature: 4,
    };
    
    it('正しくデータを変換する', () => {
        const result = prepareAudioFeaturesData(mockAudioFeatures);
        expect(result).toEqual([
            {feature: 'Danceability', value: 0.8},
            {feature: 'Energy', value: 0.6},
            {feature: 'Speechiness', value: 0.1},
            {feature: 'Acousticness', value: 0.2},
            {feature: 'Liveness', value: 0.3},
            {feature: 'Valence', value: 0.7},
        ]);
    });
    
    it('undefined が渡された場合、空の配列を返す', () => {
        const result = prepareAudioFeaturesData(undefined);
        expect(result).toEqual([]);
    });
});
