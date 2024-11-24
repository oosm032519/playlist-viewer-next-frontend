export type Mode = "MAJOR" | "MINOR";

export interface AudioFeatures {
    acousticness: number;
    danceability: number;
    energy: number;
    instrumentalness: number;
    liveness: number;
    speechiness: number;
    valence: number;
    tempo: number;
}

export interface TrackAudioFeatures extends AudioFeatures {
    durationMs: number;
    id: string;
    key: number;
    loudness: number;
    mode: Mode;
    timeSignature: number;
}
