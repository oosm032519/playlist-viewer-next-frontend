// app/components/CombinedAudioFeaturesChart.tsx

import React from 'react';
import {Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis} from 'recharts';
import {AudioFeaturesChartProps} from '@/app/types/audioFeaturesTypes';
import {prepareAudioFeaturesData} from '@/app/lib/audioFeaturesUtils';
import {AudioFeatures} from '@/app/types/audioFeatures';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/app/components/ui/chart";

/**
 * CombinedAudioFeaturesChartPropsインターフェース
 * @property {AudioFeaturesChartProps['track']} [track] - 選択されたトラックのAudioFeatures（任意）
 * @property {AudioFeatures} averageAudioFeatures - プレイリストの平均AudioFeatures
 * @property {string | null} playlistName - プレイリストの名前（nullの場合もあり）
 */
interface CombinedAudioFeaturesChartProps {
    track?: AudioFeaturesChartProps['track'];
    averageAudioFeatures: AudioFeatures;
    playlistName: string | null;
}

/**
 * CombinedAudioFeaturesChartコンポーネント
 * 選択されたトラックとプレイリストの平均AudioFeaturesを比較するレーダーチャートを表示する。
 *
 * @param {CombinedAudioFeaturesChartProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} - レーダーチャートを含むカード
 */
const CombinedAudioFeaturesChart: React.FC<CombinedAudioFeaturesChartProps> = ({
                                                                                   track,
                                                                                   averageAudioFeatures,
                                                                                   playlistName
                                                                               }) => {
    
    // プレイリスト平均のオーディオフィーチャーをデータとして準備
    const averageData = [
        {feature: 'Acousticness', value: averageAudioFeatures.acousticness},
        {feature: 'Danceability', value: averageAudioFeatures.danceability},
        {feature: 'Energy', value: averageAudioFeatures.energy},
        {feature: 'Liveness', value: averageAudioFeatures.liveness},
        {feature: 'Speechiness', value: averageAudioFeatures.speechiness},
        {feature: 'Valence', value: averageAudioFeatures.valence},
    ];
    
    // 選択されたトラックのオーディオフィーチャーデータを準備
    const trackData = track ? prepareAudioFeaturesData(track.audioFeatures) : [];
    
    // 平均データとトラックデータを結合して新しいデータセットを作成
    const combinedData = averageData.map((item, index) => ({
        ...item,
        trackValue: trackData[index]?.value,  // トラックに対応するフィーチャーがあれば追加
    }));
    
    // チャート用の設定
    const chartConfig = {
        trackValue: {
            label: track ? track.name : "トラック",
            color: "hsl(var(--chart-1))",  // トラックのチャートの色
        },
        value: {
            label: playlistName,
            color: "hsl(var(--chart-2))",  // 平均値のチャートの色
        },
    } satisfies ChartConfig;
    
    return (
        <Card className="border-border border-2">
            <CardHeader className="items-center pb-0">
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
                        
                        {/* トラックが選択されていれば、そのデータをレーダーに表示 */}
                        {track && (
                            <Radar
                                name={`${track.name}`}
                                dataKey="trackValue"
                                fill="var(--color-trackValue)"
                                fillOpacity={0.6}
                            />
                        )}
                        
                        {/* プレイリスト平均のデータをレーダーに表示 */}
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
                <span>トラックを選択すると、個別の Audio Features が表示されます。</span>
            </CardFooter>
        </Card>
    );
};

export default CombinedAudioFeaturesChart;
