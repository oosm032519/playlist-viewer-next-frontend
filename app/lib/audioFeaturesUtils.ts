// app/utils/prepareAudioFeaturesData.ts

import {Track} from '@/app/types/track';

/**
 * オーディオ特徴データを準備する関数
 *
 * @param {Track['audioFeatures'] | undefined} audioFeatures - トラックのオーディオ特徴データ
 * @returns {Array<{feature: string, value: number}>} オーディオ特徴データの配列
 */
export const prepareAudioFeaturesData = (
    audioFeatures: Track['audioFeatures'] | undefined
) => {
    // audioFeaturesが未定義の場合、空の配列を返す
    if (!audioFeatures) {
        return [];
    }
    
    // オーディオ特徴データを配列として返す
    return [
        {feature: 'Acousticness', value: audioFeatures.acousticness},
        {feature: 'Danceability', value: audioFeatures.danceability},
        {feature: 'Energy', value: audioFeatures.energy},
        {feature: 'Liveness', value: audioFeatures.liveness},
        {feature: 'Speechiness', value: audioFeatures.speechiness},
        {feature: 'Valence', value: audioFeatures.valence},
    ];
};
