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
    Tooltip
} from 'recharts';
import {AudioFeaturesChartProps} from '../types/audioFeaturesTypes';
import {prepareAudioFeaturesData} from '../lib/audioFeaturesUtils';
import {AudioFeatures} from '../types/audioFeaturesTypes';

/**
 * CombinedAudioFeaturesChartコンポーネントのプロパティを定義します。
 */
interface CombinedAudioFeaturesChartProps {
    /**
     * トラックのオーディオフィーチャー情報。オプションで指定可能。
     */
    track?: AudioFeaturesChartProps['track'];
    
    /**
     * 平均オーディオフィーチャー情報。
     */
    averageAudioFeatures: AudioFeatures;
}

/**
 * カスタムツールチップのプロパティを定義します。
 */
type CustomTooltipProps = {
    active?: boolean;
    payload?: Array<{ value: number; name: string }>;
    label?: string;
};

/**
 * CombinedAudioFeaturesChartコンポーネント
 *
 * このコンポーネントは、与えられたトラックと平均のオーディオフィーチャーを
 * レーダーチャートとして表示します。
 *
 * @param {CombinedAudioFeaturesChartProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} レーダーチャートを描画するReactコンポーネント
 */
const CombinedAudioFeaturesChart: React.FC<CombinedAudioFeaturesChartProps> = ({track, averageAudioFeatures}) => {
    // AudioFeaturesの説明
    const featureDescriptions = {
        Acousticness: 'アコースティックである度合い',
        Danceability: 'ダンスに適している度合い',
        Energy: '活気やインテンシティ',
        Liveness: 'ライブパフォーマンスの特徴を持つ度合い',
        Speechiness: '話し言葉の存在度合い',
        Valence: '音楽的なポジティブさ'
    };
    
    // 平均オーディオフィーチャーのデータを準備
    const averageData = [
        {feature: 'Acousticness', value: averageAudioFeatures.acousticness},
        {feature: 'Danceability', value: averageAudioFeatures.danceability},
        {feature: 'Energy', value: averageAudioFeatures.energy},
        {feature: 'Liveness', value: averageAudioFeatures.liveness},
        {feature: 'Speechiness', value: averageAudioFeatures.speechiness},
        {feature: 'Valence', value: averageAudioFeatures.valence},
    ];
    
    // トラックのオーディオフィーチャーのデータを準備
    const trackData = track ? prepareAudioFeaturesData(track.audioFeatures) : [];
    
    // 平均データとトラックデータを結合
    const combinedData = averageData.map((item, index) => ({
        ...item,
        trackValue: trackData[index]?.value,
    }));
    
    // Tooltip の内容をカスタマイズする関数
    const CustomTooltip = ({active, payload, label}: CustomTooltipProps) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p>{`${label}: ${featureDescriptions[label as keyof typeof featureDescriptions]}`}</p>
                    {track && <p>{`${track.name}: ${payload[0].value}`}</p>}
                    <p>{`プレイリスト平均: ${payload[track ? 1 : 0].value}`}</p>
                </div>
            );
        }
        
        return null;
    };
    
    return (
        <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={combinedData}>
                <PolarGrid/>
                <PolarAngleAxis dataKey="feature"/>
                <PolarRadiusAxis angle={30} domain={[0, 1]}/>
                {track && (
                    <Radar
                        name={`${track.name}`}
                        dataKey="trackValue"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                    />
                )}
                <Radar
                    name="プレイリスト平均"
                    dataKey="value"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                />
                <Legend/>
                <Tooltip content={<CustomTooltip/>}/>
            </RadarChart>
        </ResponsiveContainer>
    );
};

export default CombinedAudioFeaturesChart;
