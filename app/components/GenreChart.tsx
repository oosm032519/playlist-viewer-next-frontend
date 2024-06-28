import React from 'react';
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from 'recharts';
import {TooltipProps} from 'recharts';
import {NameType, ValueType} from 'recharts/types/component/DefaultTooltipContent';

interface GenreChartData {
    name: string;
    value: number;
    total: number;
}

interface GenreChartProps {
    genreCounts: { [genre: string]: number };
}

const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({active, payload}) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const percentage = ((data.value / data.total) * 100).toFixed(2);
        return (
            <div style={{
                backgroundColor: '#333',
                color: 'white',
                padding: '10px',
                border: 'none',
                borderRadius: '5px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}>
                <p style={{margin: 0}}>{`${data.name}: ${percentage}%`}</p>
            </div>
        );
    }
    return null;
};

const GenreChart: React.FC<GenreChartProps> = ({genreCounts}) => {
    const total = Object.values(genreCounts).reduce((sum, count) => sum + count, 0);
    const data: GenreChartData[] = Object.entries(genreCounts).map(([name, value]) => ({
        name,
        value,
        total
    }));
    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    innerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip/>}/>
            </PieChart>
        </ResponsiveContainer>
    );
};

export default GenreChart;
