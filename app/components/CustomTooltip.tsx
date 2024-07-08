// app/components/CustomTooltip.tsx
import React from 'react';
import {TooltipProps} from 'recharts';
import {NameType, ValueType} from 'recharts/types/component/DefaultTooltipContent';

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

export default CustomTooltip;
