// app/components/CombinedAudioFeaturesChart.tsx

import React from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import {AudioFeaturesChartProps} from '../types/audioFeaturesTypes';
import {prepareAudioFeaturesData} from '../lib/audioFeaturesUtils';
import {AudioFeatures} from '../types/audioFeaturesTypes';

interface CombinedAudioFeaturesChartProps {
    track?: AudioFeaturesChartProps['track'];
    averageAudioFeatures: AudioFeatures;
}

const CombinedAudioFeaturesChart: React.FC<CombinedAudioFeaturesChartProps> = ({track, averageAudioFeatures}) => {
    const averageData = [
        {feature: 'Acousticness', value: averageAudioFeatures.acousticness},
        {feature: 'Danceability', value: averageAudioFeatures.danceability},
        {feature: 'Energy', value: averageAudioFeatures.energy},
        {feature: 'Liveness', value: averageAudioFeatures.liveness},
        {feature: 'Speechiness', value: averageAudioFeatures.speechiness},
        {feature: 'Valence', value: averageAudioFeatures.valence},
    ];
    
    const trackData = track ? prepareAudioFeaturesData(track.audioFeatures) : [];
    
    const combinedData = averageData.map((item, index) => ({
        ...item,
        trackValue: trackData[index]?.value,
    }));
    
    return (
        <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={combinedData}>
                <PolarGrid/>
                <PolarAngleAxis dataKey="feature"/>
                <PolarRadiusAxis angle={30} domain={[0, 1]}/>
                {track && (
                    <Radar
                        name={`${track.name} の Audio Features`}
                        dataKey="trackValue"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                    />
                )}
                <Radar
                    name="平均 Audio Features"
                    dataKey="value"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                />
                <Legend/>
            </RadarChart>
        </ResponsiveContainer>
    );
};

export default CombinedAudioFeaturesChart;
