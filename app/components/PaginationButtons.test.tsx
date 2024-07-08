import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {axe, toHaveNoViolations} from 'jest-axe';
import PaginationButtons from './PaginationButtons';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

describe('PaginationButtons', () => {
    const defaultProps = {
        currentPage: 1,
        isPending: false,
        hasNextPage: true,
        onNextPage: jest.fn(),
        onPrevPage: jest.fn(),
    };
    
    it('renders without crashing', () => {
        render(<PaginationButtons {...defaultProps} />);
        expect(screen.getByText('Previous')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
    });
    
    it('disables Previous button on first page', () => {
        render(<PaginationButtons {...defaultProps} currentPage={1}/>);
        expect(screen.getByText('Previous')).toBeDisabled();
    });
    
    it('enables Previous button when not on first page', () => {
        render(<PaginationButtons {...defaultProps} currentPage={2}/>);
        expect(screen.getByText('Previous')).not.toBeDisabled();
    });
    
    it('disables Next button when there is no next page', () => {
        render(<PaginationButtons {...defaultProps} hasNextPage={false}/>);
        expect(screen.getByText('Next')).toBeDisabled();
    });
    
    it('enables Next button when there is a next page', () => {
        render(<PaginationButtons {...defaultProps} hasNextPage={true}/>);
        expect(screen.getByText('Next')).not.toBeDisabled();
    });
    
    it('calls onNextPage when Next button is clicked', () => {
        render(<PaginationButtons {...defaultProps} />);
        fireEvent.click(screen.getByText('Next'));
        expect(defaultProps.onNextPage).toHaveBeenCalled();
    });
    
    it('calls onPrevPage when Previous button is clicked', () => {
        render(<PaginationButtons {...defaultProps} currentPage={2}/>);
        fireEvent.click(screen.getByText('Previous'));
        expect(defaultProps.onPrevPage).toHaveBeenCalled();
    });
    
    it('has no accessibility violations', async () => {
        const {container} = render(<PaginationButtons {...defaultProps} />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
