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
    /**
     * ジャンルごとのカウントを保持するオブジェクト
     * キーはジャンル名、値はそのジャンルのカウント
     */
    genreCounts: { [genre: string]: number };
    /**
     * プレイリストの名前
     * nullの場合、空文字列として扱う
     */
    playlistName: string | null;
}

/**
 * GenreChartコンポーネント
 *
 * ジャンルごとのカウントを円グラフとして表示するコンポーネント。
 * プレイリスト名をグラフの中央に表示し、各ジャンルを異なる色で表現する。
 *
 * @param {GenreChartProps} props - ジャンルのカウントとプレイリスト名を含むプロパティ
 * @returns {JSX.Element} - ジャンルごとのカウントを表示する円グラフ
 */
const GenreChart: React.FC<GenreChartProps> = ({
                                                   genreCounts,
                                                   playlistName,
                                               }) => {
    // ジャンルのカウントの合計を計算
    const total = Object.values(genreCounts).reduce(
        (sum, count) => sum + count,
        0
    );
    
    // グラフ用のデータを準備
    const data = prepareChartData(genreCounts, total);
    
    // グラフの各セクションの色を定義
    const COLORS = [
        '#FF8C9E', '#7FD8A6', '#7FBFFF', '#FFE066', '#FFAF7A',
        '#C490D1', '#66E0E0', '#FF9EFF', '#B8D86B', '#FF6B6B',
    ];
    
    return (
        <ResponsiveContainer width='100%' height={300}>
            <PieChart>
                {/* プレイリスト名を中央に表示 */}
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
                    {/* 各セクションに色を適用 */}
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                    ))}
                </Pie>
                {/* カスタムツールチップを表示 */}
                <Tooltip content={<CustomTooltip/>}/>
                {/* 凡例を表示 */}
                <Legend/>
            </PieChart>
        </ResponsiveContainer>
    );
};

export default GenreChart;
