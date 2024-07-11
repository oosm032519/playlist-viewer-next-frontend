// ファイルパス: app/utils/prepareAudioFeaturesData.ts

import {Track} from '../types/track';

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
        {feature: 'Danceability', value: audioFeatures.danceability},
        {feature: 'Energy', value: audioFeatures.energy},
        {feature: 'Speechiness', value: audioFeatures.speechiness},
        {feature: 'Acousticness', value: audioFeatures.acousticness},
        {feature: 'Liveness', value: audioFeatures.liveness},
        {feature: 'Valence', value: audioFeatures.valence},
    ];
};
