import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    Text,
} from 'recharts';
import {TooltipProps} from 'recharts';
import {NameType, ValueType} from 'recharts/types/component/DefaultTooltipContent';

// Textコンポーネントをインポート
import {Text as RechartsText} from 'recharts';

interface GenreChartData {
    name: string;
    value: number;
    total: number;
}

interface GenreChartProps {
    genreCounts: { [genre: string]: number };
    playlistName: string | null;
}

// カスタムツールチップコンポーネント
const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
                                                                        active,
                                                                        payload,
                                                                    }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const percentage = ((data.value / data.total) * 100).toFixed(2);
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
                <p style={{margin: 0}}>{`${data.name}: ${percentage}%`}</p>
            </div>
        );
    }
    return null;
};

// 円グラフのデータ準備を行う関数
const prepareChartData = (
    genreCounts: { [genre: string]: number },
    total: number
): GenreChartData[] => {
    // ジャンルを出現頻度でソート
    const sortedGenres = Object.entries(genreCounts).sort(
        (a, b) => b[1] - a[1]
    );
    
    // 9つ以上のジャンルがある場合のみ、上位9ジャンルとその他を抽出
    if (sortedGenres.length > 9) {
        const topGenres = sortedGenres.slice(0, 9);
        const otherGenres = sortedGenres.slice(9);
        
        // その他のジャンルの合計値を計算
        const otherCount = otherGenres.reduce((sum, genre) => sum + genre[1], 0);
        
        // 円グラフのデータを作成
        return [
            ...topGenres.map(([name, value]) => ({name, value, total})),
            {name: 'その他', value: otherCount, total},
        ];
    } else {
        // 9つ未満の場合は全てのジャンルを返す
        return sortedGenres.map(([name, value]) => ({name, value, total}));
    }
};

const GenreChart: React.FC<GenreChartProps> = ({
                                                   genreCounts,
                                                   playlistName,
                                               }) => {
    const total = Object.values(genreCounts).reduce(
        (sum, count) => sum + count,
        0
    );
    
    // 円グラフのデータを作成
    const data = prepareChartData(genreCounts, total);
    
    const COLORS = [
        '#FF8C9E', // より濃いピンク
        '#7FD8A6', // より濃いグリーン
        '#7FBFFF', // より濃いブルー
        '#FFE066', // より濃いイエロー
        '#FFAF7A', // より濃いオレンジ
        '#C490D1', // より濃いパープル
        '#66E0E0', // より濃いターコイズ
        '#FF9EFF', // より濃いラベンダー
        '#B8D86B', // より濃いライムグリーン
        '#FF6B6B', // より濃いローズ
    ];
    
    return (
        <ResponsiveContainer width='100%' height={300}>
            <PieChart>
                {/* RechartsTextコンポーネントを使用 */}
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
                <Legend/> {/* 凡例を追加 */}
            </PieChart>
        </ResponsiveContainer>
    );
};

export default GenreChart;
export {prepareChartData};
