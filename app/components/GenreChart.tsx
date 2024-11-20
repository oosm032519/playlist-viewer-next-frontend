// app/components/GenreChart.tsx

"use client"

import React from 'react';
import {Pie, PieChart, Cell} from "recharts";
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
    ChartTooltip,
} from "@/app/components/ui/chart";

/**
 * `GenreChart`コンポーネントのプロパティ（props）の型定義
 * @property genreCounts - 各ジャンルのカウントを保持するオブジェクト。キーはジャンル名、値はそのジャンルのカウント。
 * @property playlistName - プレイリストの名前。
 */
interface GenreChartProps {
    genreCounts: { [genre: string]: number };
    playlistName: string | null;
}

// グラフに使用する色の配列
const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
];

/**
 * プレイリスト内のジャンル分布を円グラフで表示するコンポーネント。
 * @param genreCounts - ジャンルごとのカウントデータ
 * @param playlistName - プレイリストの名前
 * @returns {JSX.Element} ジャンル分布を可視化する円グラフ
 */
const GenreChart: React.FC<GenreChartProps> = ({
                                                   genreCounts,
                                                   playlistName,
                                               }) => {
    // 全ジャンルのカウントの合計を計算
    const total = Object.values(genreCounts).reduce((sum, count) => sum + count, 0);
    
    // ジャンルをカウント順にソートし、上位4つを取得
    const sortedGenres = Object.entries(genreCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4);
    
    // 上位4位以外のジャンルの合計を計算
    const otherCount = Object.entries(genreCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(4)
        .reduce((sum, [, count]) => sum + count, 0);
    
    // グラフに使用するデータを整形
    const data = [
        ...sortedGenres.map(([name, value], index) => ({
            name,
            value,
            percentage: (value / total) * 100, // 各ジャンルの割合を計算
            color: COLORS[index % COLORS.length], // 色を循環させる
        })),
        {
            name: 'その他',
            value: otherCount,
            percentage: (otherCount / total) * 100, // その他のジャンルの割合
            color: COLORS[4], // "その他"は固定色
        }
    ];
    
    // ChartConfigオブジェクトの生成。各ジャンルとその色を設定。
    const chartConfig: ChartConfig = data.reduce((config, item) => {
        config[item.name] = {
            label: item.name,
            color: item.color,
        };
        return config;
    }, {} as ChartConfig);
    
    /**
     * カスタムツールチップの内容を表示するためのコンポーネント。
     * @param active - ツールチップがアクティブかどうか
     * @param payload - グラフから渡されるデータ
     * @returns {JSX.Element | null} ツールチップの内容、もしくは何も表示しない場合はnull
     */
    const CustomTooltipContent = ({active, payload}: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div
                    style={{
                        backgroundColor: '#333',
                        color: 'white',
                        padding: '10px',
                        border: 'none',
                        borderRadius: '5px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    }}
                >
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div
                            style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: data.color,
                                marginRight: '8px',
                            }}
                        />
                        <p style={{margin: 0}}>{`${data.name}: ${data.percentage.toFixed(1)}%`}</p>
                    </div>
                </div>
            );
        }
        return null;
    };
    
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{playlistName || 'ジャンル分布'}</CardTitle>
                <CardDescription>プレイリストのジャンル分布</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        {/* カーソルを非表示にし、カスタムツールチップを設定 */}
                        <ChartTooltip
                            cursor={false}
                            content={<CustomTooltipContent/>}
                        />
                        <Pie
                            data={data} // 円グラフのデータ
                            dataKey="value" // 値に基づいてサイズが決まる
                            nameKey="name" // 各セクションに名前を付ける
                            innerRadius={60}
                            outerRadius={80}
                        >
                            {/* 各データに対応するセルの描画 */}
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color}/>
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex flex-wrap justify-center gap-4 pt-4">
                {/* 凡例の表示 */}
                {data.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center">
                        <div
                            className="w-3 h-3 mr-2 rounded-full"
                            style={{backgroundColor: entry.color}}
                        />
                        <span className="text-sm">
                            {entry.name}: {entry.percentage.toFixed(1)}%
                        </span>
                    </div>
                ))}
            </CardFooter>
        </Card>
    );
};

export default GenreChart;
