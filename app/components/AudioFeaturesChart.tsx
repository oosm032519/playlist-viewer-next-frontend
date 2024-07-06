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
import {AudioFeaturesChartProps} from '../types/audioFeaturesTypes';
import {prepareAudioFeaturesData} from '../lib/audioFeaturesUtils';

const AudioFeaturesChart: React.FC<AudioFeaturesChartProps> = ({track}) => {
    const data = prepareAudioFeaturesData(track.audioFeatures);
    
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
