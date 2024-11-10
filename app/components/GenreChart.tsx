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

interface GenreChartProps {
    genreCounts: { [genre: string]: number };
    playlistName: string | null;
}

const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
];

const GenreChart: React.FC<GenreChartProps> = ({
                                                   genreCounts,
                                                   playlistName,
                                               }) => {
    const total = Object.values(genreCounts).reduce((sum, count) => sum + count, 0);
    
    const sortedGenres = Object.entries(genreCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4);
    
    const otherCount = Object.entries(genreCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(4)
        .reduce((sum, [, count]) => sum + count, 0);
    
    const data = [
        ...sortedGenres.map(([name, value], index) => ({
            name,
            value,
            percentage: (value / total) * 100,
            color: COLORS[index % COLORS.length]
        })),
        {
            name: 'その他',
            value: otherCount,
            percentage: (otherCount / total) * 100,
            color: COLORS[4]
        }
    ];
    
    const chartConfig: ChartConfig = data.reduce((config, item) => {
        config[item.name] = {
            label: item.name,
            color: item.color,
        };
        return config;
    }, {} as ChartConfig);
    
    // カスタムツールチップコンテンツ
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
                        <ChartTooltip
                            cursor={false}
                            content={<CustomTooltipContent/>}
                        />
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={80}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color}/>
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex flex-wrap justify-center gap-4 pt-4">
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
