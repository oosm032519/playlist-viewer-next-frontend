import {Track} from '../types/track';

export interface AudioFeaturesChartProps {
    track: Track;
}

export interface AudioFeatures {
    acousticness: number;
    danceability: number;
    energy: number;
    instrumentalness: number;
    liveness: number;
    speechiness: number;
    valence: number;
}
