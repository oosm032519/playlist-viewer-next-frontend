// app/components/GenreChart.tsx
import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    Text as RechartsText,
} from 'recharts';
import CustomTooltip from './CustomTooltip';
import prepareChartData from '../utils/prepareChartData';

interface GenreChartProps {
    genreCounts: { [genre: string]: number };
    playlistName: string | null;
}

const GenreChart: React.FC<GenreChartProps> = ({
                                                   genreCounts,
                                                   playlistName,
                                               }) => {
    const total = Object.values(genreCounts).reduce(
        (sum, count) => sum + count,
        0
    );
    
    const data = prepareChartData(genreCounts, total);
    
    const COLORS = [
        '#FF8C9E', '#7FD8A6', '#7FBFFF', '#FFE066', '#FFAF7A',
        '#C490D1', '#66E0E0', '#FF9EFF', '#B8D86B', '#FF6B6B',
    ];
    
    return (
        <ResponsiveContainer width='100%' height={300}>
            <PieChart>
                <RechartsText
                    x={125}
                    y={150}
                    textAnchor='middle'
                    dominantBaseline='central'
                    fontSize={16}
                >
                    {playlistName || ''}
                </RechartsText>
                <Pie
                    data={data}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    outerRadius={100}
                    innerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip/>}/>
                <Legend/>
            </PieChart>
        </ResponsiveContainer>
    );
};

export default GenreChart;
