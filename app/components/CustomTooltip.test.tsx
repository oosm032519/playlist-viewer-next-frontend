// app/components/CustomTooltip.test.tsx
import React from 'react';
import {render} from '@testing-library/react';
import {axe, toHaveNoViolations} from 'jest-axe';
import CustomTooltip from './CustomTooltip';
import {TooltipProps} from 'recharts';
import {NameType, ValueType} from 'recharts/types/component/DefaultTooltipContent';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

const mockPayload = [
    {
        payload: {
            name: 'Test Name',
            value: 50,
            total: 100,
        },
    },
];

const defaultProps: TooltipProps<ValueType, NameType> = {
    active: true,
    payload: mockPayload,
    label: '',
    coordinate: {x: 0, y: 0},
    offset: 0,
    position: {x: 0, y: 0},
    separator: '',
    formatter: (value: ValueType) => value,
    itemStyle: {},
    labelStyle: {},
    wrapperStyle: {},
    cursor: false,
    contentStyle: {},
    viewBox: {x: 0, y: 0, width: 0, height: 0},
};

describe('CustomTooltip', () => {
    it('renders correctly when active and payload is provided', () => {
        const {getByText} = render(<CustomTooltip {...defaultProps} />);
        expect(getByText('Test Name: 50.00%')).toBeInTheDocument();
    });
    
    it('returns null when not active', () => {
        const {container} = render(<CustomTooltip {...defaultProps} active={false}/>);
        expect(container.firstChild).toBeNull();
    });
    
    it('returns null when payload is empty', () => {
        const {container} = render(<CustomTooltip {...defaultProps} payload={[]}/>);
        expect(container.firstChild).toBeNull();
    });
    
    it('is accessible', async () => {
        const {container} = render(<CustomTooltip {...defaultProps} />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
