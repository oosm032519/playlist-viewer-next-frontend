// app/types/audioFeaturesTypes.ts

import {Track} from '@/app/types/track';

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
