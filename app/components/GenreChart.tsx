// app/components/GenreChart.tsx
import React from 'react';
import {PieChart, Pie, Cell, ResponsiveContainer} from 'recharts';

interface GenreChartData {
    name: string;
    value: number;
}

interface GenreChartProps {
    genreCounts: { [genre: string]: number };
}

const GenreChart: React.FC<GenreChartProps> = ({genreCounts}) => {
    const data: GenreChartData[] = Object.entries(genreCounts).map(([name, value]) => ({name, value}));
    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};

export default GenreChart;
