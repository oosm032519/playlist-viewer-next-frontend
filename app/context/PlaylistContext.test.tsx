// app/context/PlaylistContext.test.tsx

import React from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import {PlaylistContextProvider, usePlaylist} from '@/app/context/PlaylistContext';
import {axe, toHaveNoViolations} from 'jest-axe';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

describe('PlaylistContextProvider', () => {
    it('renders without crashing', () => {
        render(
            <PlaylistContextProvider>
                <div>Test Child</div>
            </PlaylistContextProvider>
        );
        expect(screen.getByText('Test Child')).toBeInTheDocument();
    });
    
    it('has no accessibility violations', async () => {
        const {container} = render(
            <PlaylistContextProvider>
                <div>Test Child</div>
            </PlaylistContextProvider>
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    it('provides the correct context value', async () => {
        const TestComponent = () => {
            const {selectedPlaylistId, setSelectedPlaylistId} = usePlaylist();
            return (
                <div>
                    <span data-testid="playlist-id">{selectedPlaylistId}</span>
                    <button onClick={() => setSelectedPlaylistId('test-id')}>Set ID</button>
                </div>
            );
        };
        
        render(
            <PlaylistContextProvider>
                <TestComponent/>
            </PlaylistContextProvider>
        );
        
        expect(screen.getByTestId('playlist-id').textContent).toBe('');
        
        await act(async () => {
            fireEvent.click(screen.getByRole('button'));
        });
        
        expect(screen.getByTestId('playlist-id').textContent).toBe('test-id');
    });
    
    it('throws an error when usePlaylist is used outside of PlaylistContextProvider', () => {
        const TestComponent = () => {
            usePlaylist();
            return null;
        };
        
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });
        
        expect(() => {
            render(<TestComponent/>);
        }).toThrow('usePlaylist must be used within a PlaylistContextProvider');
        
        consoleErrorSpy.mockRestore();
    });
});
