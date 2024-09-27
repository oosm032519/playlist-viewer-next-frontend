// CombinedAudioFeaturesChart.tsx

import React from 'react';
import {Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis} from 'recharts';
import {AudioFeaturesChartProps} from '../types/audioFeaturesTypes';
import {prepareAudioFeaturesData} from '../lib/audioFeaturesUtils';
import {AudioFeatures} from '../types/audioFeaturesTypes';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "./ui/chart";

interface CombinedAudioFeaturesChartProps {
    track?: AudioFeaturesChartProps['track'];
    averageAudioFeatures: AudioFeatures;
    playlistName: string | null;
}

const CombinedAudioFeaturesChart: React.FC<CombinedAudioFeaturesChartProps> = ({track, averageAudioFeatures,
                                                                                   playlistName}) => {
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
    
    const chartConfig = {
        trackValue: {
            label: track ? track.name : "トラック",
            color: "hsl(var(--chart-1))",
        },
        value: {
            label: playlistName,
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig;
    
    return (
        <Card>
            <CardHeader className="items-center pb-4">
                <CardTitle>{playlistName || 'Audio Features レーダーチャート'}</CardTitle>
                <CardDescription>
                    選択トラックとプレイリスト平均のAudio Featuresの比較
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[400px]">
                    <RadarChart data={combinedData} cx="50%" cy="50%" outerRadius="80%">
                        <PolarGrid/>
                        <PolarAngleAxis dataKey="feature"/>
                        <PolarRadiusAxis angle={30} domain={[0, 1]}/>
                        {track && (
                            <Radar
                                name={`${track.name}`}
                                dataKey="trackValue"
                                fill="var(--color-trackValue)"
                                fillOpacity={0.6}
                            />
                        )}
                        <Radar
                            name={`${playlistName}`}
                            dataKey="value"
                            fill="var(--color-value)"
                            fillOpacity={0.6}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line"/>}/>
                        <ChartLegend className="mt-8" content={<ChartLegendContent/>}/>
                    </RadarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 pt-4 text-sm">
                {/* フッターコンテンツを追加する場合はここに */}
            </CardFooter>
        </Card>
    );
};

export default CombinedAudioFeaturesChart;
