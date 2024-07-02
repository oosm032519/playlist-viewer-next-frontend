// app/components/__tests__/LoadingSpinner.test.tsx

import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {axe, toHaveNoViolations} from 'jest-axe';
import LoadingSpinner from '../LoadingSpinner';

expect.extend(toHaveNoViolations);

describe('LoadingSpinner', () => {
    it('renders the spinner when loading is true', () => {
        render(<LoadingSpinner loading={true}/>);
        
        const spinner = screen.getByRole('progressbar', {hidden: true});
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveStyle('display: flex');
    });
    
    it('does not render the spinner when loading is false', () => {
        render(<LoadingSpinner loading={false}/>);
        
        const spinner = screen.getByRole('progressbar', {hidden: true});
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveStyle('display: none');
    });
    
    it('has correct aria attributes when loading', () => {
        render(<LoadingSpinner loading={true}/>);
        
        const spinner = screen.getByRole('progressbar', {hidden: true});
        expect(spinner).toHaveAttribute('aria-valuenow', '100');
        expect(spinner).toHaveAttribute('aria-valuemin', '0');
        expect(spinner).toHaveAttribute('aria-valuemax', '100');
        expect(spinner).toHaveAttribute('aria-label', 'Loading progress');
    });
    
    it('has correct aria attributes when not loading', () => {
        render(<LoadingSpinner loading={false}/>);
        
        const spinner = screen.getByRole('progressbar', {hidden: true});
        expect(spinner).toHaveAttribute('aria-valuenow', '0');
        expect(spinner).toHaveAttribute('aria-valuemin', '0');
        expect(spinner).toHaveAttribute('aria-valuemax', '100');
        expect(spinner).toHaveAttribute('aria-label', 'Loading progress');
    });
    
    it('applies correct styles to the spinner container', () => {
        render(<LoadingSpinner loading={true}/>);
        
        const spinner = screen.getByRole('progressbar', {hidden: true});
        expect(spinner).toHaveClass('fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/50 z-50');
    });
    
    it('renders ClipLoader when loading is true', () => {
        render(<LoadingSpinner loading={true}/>);
        
        const clipLoader = screen.getByRole('progressbar', {hidden: true}).querySelector('span');
        expect(clipLoader).toBeInTheDocument();
        expect(clipLoader).toHaveAttribute('aria-hidden', 'true');
    });
    
    it('does not render ClipLoader when loading is false', () => {
        render(<LoadingSpinner loading={false}/>);
        
        const progressbar = screen.getByRole('progressbar', {hidden: true});
        const clipLoader = progressbar.querySelector('span');
        expect(clipLoader).not.toBeInTheDocument();
    });
    
    it('should not have any accessibility violations', async () => {
        const {container} = render(<LoadingSpinner loading={true}/>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    it('should update aria-valuenow when loading prop changes', () => {
        const {rerender} = render(<LoadingSpinner loading={false}/>);
        
        let spinner = screen.getByRole('progressbar', {hidden: true});
        expect(spinner).toHaveAttribute('aria-valuenow', '0');
        
        rerender(<LoadingSpinner loading={true}/>);
        spinner = screen.getByRole('progressbar', {hidden: true});
        expect(spinner).toHaveAttribute('aria-valuenow', '100');
    });
    
    it('should have correct color for ClipLoader', () => {
        render(<LoadingSpinner loading={true}/>);
        
        const clipLoader = screen.getByRole('progressbar', {hidden: true}).querySelector('span');
        expect(clipLoader).toHaveStyle('border-top-color: #1DB954');
    });
    
    it('should have correct size for ClipLoader', () => {
        render(<LoadingSpinner loading={true}/>);
        
        const clipLoader = screen.getByRole('progressbar', {hidden: true}).querySelector('span');
        expect(clipLoader).toHaveStyle('width: 100px; height: 100px');
    });
});
