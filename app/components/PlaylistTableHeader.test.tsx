import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {axe, toHaveNoViolations} from 'jest-axe';
import PlaylistTableHeader from './PlaylistTableHeader';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

describe('PlaylistTableHeader', () => {
    it('renders the table header with correct columns', () => {
        render(
            <table>
                <PlaylistTableHeader/>
            </table>
        );
        
        // Check if the table headers are rendered correctly
        expect(screen.getByText('Image')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Tracks')).toBeInTheDocument();
    });
    
    it('has no accessibility violations', async () => {
        const {container} = render(
            <table>
                <PlaylistTableHeader/>
            </table>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
