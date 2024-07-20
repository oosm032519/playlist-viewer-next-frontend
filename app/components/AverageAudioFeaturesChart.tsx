// app/components/AverageAudioFeaturesChart.tsx

import React from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from 'recharts';
import {AudioFeatures} from '../types/audioFeaturesTypes';

interface AverageAudioFeaturesChartProps {
    averageAudioFeatures: AudioFeatures;
}

const AverageAudioFeaturesChart: React.FC<AverageAudioFeaturesChartProps> = ({averageAudioFeatures}) => {
    const data = [
        {feature: 'Acousticness', value: averageAudioFeatures.acousticness},
        {feature: 'Danceability', value: averageAudioFeatures.danceability},
        {feature: 'Energy', value: averageAudioFeatures.energy},
        {feature: 'Liveness', value: averageAudioFeatures.liveness},
        {feature: 'Speechiness', value: averageAudioFeatures.speechiness},
        {feature: 'Valence', value: averageAudioFeatures.valence},
    ];
    
    return (
        <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid/>
                <PolarAngleAxis dataKey="feature"/>
                <PolarRadiusAxis angle={30} domain={[0, 1]}/>
                <Radar
                    name="Average Audio Features"
                    dataKey="value"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                />
            </RadarChart>
        </ResponsiveContainer>
    );
};

export default AverageAudioFeaturesChart;
