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

/**
 * AudioFeaturesChartコンポーネント
 *
 * @param {AudioFeaturesChartProps} props - トラックのオーディオフィーチャーを含むプロパティ
 * @returns {JSX.Element} レーダーチャートを表示するReactコンポーネント
 */
const AudioFeaturesChart: React.FC<AudioFeaturesChartProps> = ({track}) => {
    // トラックのオーディオフィーチャーデータを準備する
    const data = prepareAudioFeaturesData(track.audioFeatures);
    
    return (
        // コンポーネントのサイズをレスポンシブに設定
        <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                {/* レーダーチャートのグリッドを表示 */}
                <PolarGrid/>
                {/* 各オーディオフィーチャーのラベルを表示 */}
                <PolarAngleAxis dataKey="feature"/>
                {/* レーダーチャートの半径軸を設定 */}
                <PolarRadiusAxis angle={30} domain={[0, 1]}/>
                {/* レーダーチャートのデータを表示 */}
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
