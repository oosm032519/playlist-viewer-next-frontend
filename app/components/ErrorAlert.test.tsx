import React from 'react';
import {render, screen} from '@testing-library/react';
import {axe, toHaveNoViolations} from 'jest-axe';
import ErrorAlert from '@/app/components/ErrorAlert';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

describe('ErrorAlert Component', () => {
    it('renders the ErrorAlert component correctly', () => {
        const errorMessage = 'Test error message';
        render(<ErrorAlert error={errorMessage}/>);
        
        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    
    it('displays the correct alert title', () => {
        render(<ErrorAlert error="Any error"/>);
        
        const alertTitle = screen.getByText('Error');
        expect(alertTitle).toBeInTheDocument();
        expect(alertTitle.tagName).toBe('H5'); // AlertTitleがh5タグを使用していると仮定
    });
    
    it('displays the provided error message', () => {
        const errorMessage = 'Custom error message';
        render(<ErrorAlert error={errorMessage}/>);
        
        const alertDescription = screen.getByText(errorMessage);
        expect(alertDescription).toBeInTheDocument();
        expect(alertDescription.tagName).toBe('DIV'); // AlertDescriptionがdivタグを使用していると仮定
    });
    
    it('has no accessibility violations', async () => {
        const {container} = render(<ErrorAlert error="Test error"/>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
});
