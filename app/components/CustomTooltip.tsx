// app/components/CustomTooltip.tsx

import React from 'react';
import {TooltipProps} from 'recharts';
import {NameType, ValueType} from 'recharts/types/component/DefaultTooltipContent';

/**
 * カスタムツールチップコンポーネント
 *
 * @param {TooltipProps<ValueType, NameType>} props - ツールチップのプロパティ
 * @returns {JSX.Element | null} ツールチップのJSX要素またはnull
 */
const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
                                                                        active,
                                                                        payload,
                                                                    }: TooltipProps<ValueType, NameType>): JSX.Element | null => {
    // ツールチップがアクティブで、payloadが存在し、かつpayloadの長さが1以上の場合
    if (active && payload && payload.length) {
        // payloadからデータを取得
        const data = payload[0].payload;
        // データの値をパーセンテージに変換
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
                {/* データ名とパーセンテージを表示 */}
                <p style={{margin: 0}}>{`${data.name}: ${percentage}%`}</p>
            </div>
        );
    }
    // ツールチップが非アクティブの場合は何も表示しない
    return null;
};

export default CustomTooltip;
