// app/types/audioFeatures.ts

/**
 * オーディオ特徴量。
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

/**
 * トラックのオーディオ特徴量（拡張情報を含む）。
 */
export interface TrackAudioFeatures extends AudioFeatures {
    analysisUrl: string;
    durationMs: number;
    id: string;
    key: number;
    loudness: number;
    mode: string;
    tempo: number;
    timeSignature: number;
    trackHref: string;
    type: string;
    uri: string;
}
