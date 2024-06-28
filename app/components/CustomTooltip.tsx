import React from 'react';
import {TooltipProps} from 'recharts';
import {NameType, ValueType} from 'recharts/types/component/DefaultTooltipContent';

const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({active, payload}) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const percentage = ((data.value / data.total) * 100).toFixed(2);
        return (
            <div style={{backgroundColor: 'white', padding: '5px', border: '1px solid #ccc'}}>
                <p>{`${data.name}: ${percentage}%`}</p>
            </div>
        );
    }
    return null;
};
