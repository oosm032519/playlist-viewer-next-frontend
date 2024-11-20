// app/types/playlist.ts

import {Track, TrackAudioFeatures} from '@/app/types/track';

/**
 * プレイリストのイメージ情報を表すインターフェース
 * @property {number} height - 画像の高さ
 * @property {string} url - 画像のURL
 * @property {number} width - 画像の幅
 */
export interface PlaylistImage {
    height: number;
    url: string;
    width: number;
}

/**
 * プレイリスト内のトラック情報を表すインターフェース
 * @property {Track} track - トラックの詳細情報
 * @property {TrackAudioFeatures} [audioFeatures] - トラックのオーディオ特徴 (任意)
 */
export interface PlaylistTrack {
    track: Track;
    audioFeatures?: TrackAudioFeatures;
}

/**
 * プレイリスト内のトラックのリストを表すインターフェース
 * @property {PlaylistTrack[]} items - プレイリストに含まれるトラックの配列
 */
export interface PlaylistTracks {
    items: PlaylistTrack[];
}

/**
 * トラックのAudioFeaturesを表すインターフェース
 * @property {number} acousticness - アコースティック性（0〜1）
 * @property {number} liveness - ライブ感（0〜1）
 * @property {number} tempo - テンポ（BPM）
 * @property {number} valence - 感情的なポジティブ度合い（0〜1）
 * @property {number} instrumentalness - インストゥルメンタル度（0〜1）
 * @property {number} danceability - ダンス性（0〜1）
 * @property {number} speechiness - スピーチ度合い（0〜1）
 * @property {number} energy - エネルギー度（0〜1）
 */
export interface AudioFeatures {
    acousticness: number;
    liveness: number;
    tempo: number;
    valence: number;
    instrumentalness: number;
    danceability: number;
    speechiness: number;
    energy: number;
}

/**
 * プレイリスト全体の情報を表すインターフェース
 * @property {number} totalDuration - プレイリスト全体の再生時間 (ミリ秒単位)
 * @property {string} ownerName - プレイリストの所有者の名前
 * @property {AudioFeatures} minAudioFeatures - プレイリスト内のトラックの最小AudioFeatures
 * @property {string[]} seedArtists - おすすめ楽曲取得に使用するアーティストのIDリスト
 * @property {string} ownerId - プレイリストの所有者のID
 * @property {AudioFeatures} maxAudioFeatures - プレイリスト内のトラックの最大AudioFeatures
 * @property {PlaylistTracks} tracks - プレイリストに含まれるトラックのリスト
 * @property {PlaylistImage[]} images - プレイリストのイメージ画像のリスト
 * @property {string} playlistName - プレイリストの名前
 * @property {AudioFeatures} averageAudioFeatures - プレイリスト内のトラックの平均AudioFeatures
 * @property {{ [key: string]: number }} genreCounts - プレイリストに含まれるジャンルのカウント
 */
export interface Playlist {
    totalDuration: number;
    ownerName: string;
    minAudioFeatures: AudioFeatures;
    seedArtists: string[];
    ownerId: string;
    maxAudioFeatures: AudioFeatures;
    tracks: PlaylistTracks;
    images: PlaylistImage[];
    playlistName: string;
    averageAudioFeatures: AudioFeatures;
    genreCounts: { [key: string]: number };
}
