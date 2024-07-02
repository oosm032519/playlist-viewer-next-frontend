import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner from '../LoadingSpinner';

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
    });
    
    it('has correct aria attributes when not loading', () => {
        render(<LoadingSpinner loading={false}/>);
        
        const spinner = screen.getByRole('progressbar', {hidden: true});
        expect(spinner).toHaveAttribute('aria-valuenow', '0');
    });
    
    it('applies correct styles to the spinner container', () => {
        render(<LoadingSpinner loading={true}/>);
        
        const spinner = screen.getByRole('progressbar', {hidden: true});
        expect(spinner).toHaveClass('fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/50 z-50');
    });
    
    it('renders ClipLoader when loading is true', () => {
        render(<LoadingSpinner loading={true}/>);
        
        const clipLoader = screen.getByLabelText('Loading Spinner');
        expect(clipLoader).toBeInTheDocument();
    });
    
    it('does not render ClipLoader when loading is false', () => {
        render(<LoadingSpinner loading={false}/>);
        
        const clipLoader = screen.queryByLabelText('Loading Spinner');
        expect(clipLoader).not.toBeInTheDocument();
    });
});
