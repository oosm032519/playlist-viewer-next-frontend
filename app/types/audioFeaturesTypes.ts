// app/types/audioFeaturesTypes.ts

import {Track} from '@/app/types/track';

/**
 * AudioFeaturesチャートコンポーネントのpropsを定義するインターフェース。
 * @property {Track} track - 表示するトラックのデータオブジェクト
 */
export interface AudioFeaturesChartProps {
    track: Track;
}

/**
 * AudioFeaturesは、トラックのオーディオ特徴量を定義するインターフェース。
 * 各特徴量はSpotify APIから取得される音楽的特徴。
 * @property {number} acousticness - 曲のアコースティック性（0.0から1.0の範囲）
 * @property {number} danceability - 曲のダンス性（0.0から1.0の範囲）
 * @property {number} energy - 曲のエネルギー量（0.0から1.0の範囲）
 * @property {number} instrumentalness - 曲のインストゥルメンタル性（0.0から1.0の範囲）
 * @property {number} liveness - 曲のライブ感の度合い（0.0から1.0の範囲）
 * @property {number} speechiness - 曲のスピーチ性（0.0から1.0の範囲）
 * @property {number} valence - 曲の感情的ポジティブ性（0.0から1.0の範囲）
 */
export interface AudioFeatures {
    acousticness: number;
    danceability: number;
    energy: number;
    instrumentalness: number;
    liveness: number;
    speechiness: number;
    valence: number;
}
