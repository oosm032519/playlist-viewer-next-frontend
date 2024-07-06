import {Track} from '../types/track';

export interface AudioFeaturesChartProps {
    track: Track;
}

export interface AudioFeatureData {
    feature: string;
    value: number;
}
