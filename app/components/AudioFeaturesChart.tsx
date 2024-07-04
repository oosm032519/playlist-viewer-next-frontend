// app/components/AudioFeaturesChart.tsx

import React from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from 'recharts';
import {Track} from '@/app/types/track';

interface AudioFeaturesChartProps {
    track: Track;
}

// 音声の特徴データを変換する関数を定義
    const prepareAudioFeaturesData = (
    audioFeatures: Track['audioFeatures'] | undefined
) => {
    if (!audioFeatures) {
        return [];
    }
    return [
        {feature: 'Danceability', value: audioFeatures.danceability},
        {feature: 'Energy', value: audioFeatures.energy},
        {feature: 'Speechiness', value: audioFeatures.speechiness},
        {feature: 'Acousticness', value: audioFeatures.acousticness},
        {feature: 'Liveness', value: audioFeatures.liveness},
        {feature: 'Valence', value: audioFeatures.valence},
    ];
};

const AudioFeaturesChart: React.FC<AudioFeaturesChartProps> = ({track}) => {
    const audioFeatures = track.audioFeatures;
    
    // データ変換関数を呼び出してデータを取得
    const data = prepareAudioFeaturesData(audioFeatures);
    
    return (
        <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid/>
                <PolarAngleAxis dataKey="feature"/>
                <PolarRadiusAxis angle={30} domain={[0, 1]}/>
                <Radar
                    name="Audio Features"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                />
            </RadarChart>
        </ResponsiveContainer>
    );
};

export default AudioFeaturesChart;
