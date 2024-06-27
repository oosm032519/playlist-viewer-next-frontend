import React from 'react';
import {Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer} from 'recharts';
import {Track} from '@/app/types/track';

interface AudioFeaturesChartProps {
    track: Track;
}

const AudioFeaturesChart: React.FC<AudioFeaturesChartProps> = ({track}) => {
    const audioFeatures = track.audioFeatures;
    
    if (!audioFeatures) {
        return <div>No audio features available</div>;
    }
    
    const data = [
        {feature: 'Danceability', value: audioFeatures.danceability},
        {feature: 'Energy', value: audioFeatures.energy},
        {feature: 'Speechiness', value: audioFeatures.speechiness},
        {feature: 'Acousticness', value: audioFeatures.acousticness},
        {feature: 'Liveness', value: audioFeatures.liveness},
        {feature: 'Valence', value: audioFeatures.valence},
    ];
    
    return (
        <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid/>
                <PolarAngleAxis dataKey="feature"/>
                <PolarRadiusAxis angle={30} domain={[0, 1]}/>
                <Radar name="Audio Features" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6}/>
            </RadarChart>
        </ResponsiveContainer>
    );
};

export default AudioFeaturesChart;
