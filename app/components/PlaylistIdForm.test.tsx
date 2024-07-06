// app/components/PlaylistIdForm.test.tsx

"use client";

import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {axe, toHaveNoViolations} from 'jest-axe';
import PlaylistIdForm from './PlaylistIdForm';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

// React Query のモックセットアップ
const queryClient = new QueryClient();
const wrapper = ({children}: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('PlaylistIdForm', () => {
    // モック関数の型を明示的に定義
    const createMockOnPlaylistSelect = (): jest.Mock<Promise<void>, [string]> =>
        jest.fn((playlistId: string) => Promise.resolve());
    
    // アクセシビリティテスト
    it('should not have any accessibility violations', async () => {
        const mockOnPlaylistSelect = createMockOnPlaylistSelect();
        const {container} = render(
            <PlaylistIdForm onPlaylistSelect={mockOnPlaylistSelect}/>,
            {wrapper}
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    // 入力フィールドのテスト
    describe('Input field', () => {
        it('should be visible and enabled', () => {
            const mockOnPlaylistSelect = createMockOnPlaylistSelect();
            render(<PlaylistIdForm onPlaylistSelect={mockOnPlaylistSelect}/>, {
                wrapper,
            });
            const inputElement = screen.getByPlaceholderText('Enter playlist URL');
            expect(inputElement).toBeInTheDocument();
            expect(inputElement).toBeEnabled();
        });
        
        it('should update value when user types', () => {
            const mockOnPlaylistSelect = createMockOnPlaylistSelect();
            render(<PlaylistIdForm onPlaylistSelect={mockOnPlaylistSelect}/>, {
                wrapper,
            });
            const inputElement = screen.getByPlaceholderText(
                'Enter playlist URL'
            ) as HTMLInputElement;
            fireEvent.change(inputElement, {
                target: {value: 'https://open.spotify.com/playlist/123'},
            });
            expect(inputElement.value).toBe(
                'https://open.spotify.com/playlist/123'
            );
        });
    });
    
    // 送信ボタンのテスト
    describe('Submit button', () => {
        it('should be visible and enabled initially', () => {
            const mockOnPlaylistSelect = createMockOnPlaylistSelect();
            render(<PlaylistIdForm onPlaylistSelect={mockOnPlaylistSelect}/>, {
                wrapper,
            });
            const submitButton = screen.getByRole('button', {name: /Submit/i});
            expect(submitButton).toBeInTheDocument();
            expect(submitButton).toBeEnabled();
        });
        
        it('should be disabled during form submission', async () => {
            const mockOnPlaylistSelect = jest.fn(
                (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 1000))
            );
            render(<PlaylistIdForm onPlaylistSelect={mockOnPlaylistSelect}/>, {
                wrapper,
            });
            const inputElement = screen.getByPlaceholderText('Enter playlist URL');
            const submitButton = screen.getByRole('button', {name: /Submit/i});
            
            fireEvent.change(inputElement, {
                target: {
                    value: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
                },
            });
            fireEvent.click(submitButton);
            
            // ボタンが無効化されるのを待つ
            await waitFor(() => {
                expect(submitButton).toBeDisabled();
            });
            
            // 処理が完了してボタンが再び有効になるのを待つ
            await waitFor(() => {
                expect(submitButton).toBeEnabled();
            }, {timeout: 2000});
        });
        
        // フォーム送信のテスト
        describe('Form submission', () => {
            it('should call onPlaylistSelect with correct ID for valid URL', async () => {
                const mockOnPlaylistSelect = createMockOnPlaylistSelect();
                render(<PlaylistIdForm onPlaylistSelect={mockOnPlaylistSelect}/>, {
                    wrapper,
                });
                const inputElement = screen.getByPlaceholderText('Enter playlist URL');
                const submitButton = screen.getByRole('button', {name: /Submit/i});
                fireEvent.change(inputElement, {
                    target: {
                        value: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
                    },
                });
                fireEvent.click(submitButton);
                await waitFor(() => {
                    expect(mockOnPlaylistSelect).toHaveBeenCalledWith(
                        '37i9dQZF1DXcBWIGoYBM5M'
                    );
                });
            });
            
            it('should not call onPlaylistSelect for invalid URL', async () => {
                const mockOnPlaylistSelect = createMockOnPlaylistSelect();
                render(<PlaylistIdForm onPlaylistSelect={mockOnPlaylistSelect}/>, {
                    wrapper,
                });
                const inputElement = screen.getByPlaceholderText('Enter playlist URL');
                const submitButton = screen.getByRole('button', {name: /Submit/i});
                fireEvent.change(inputElement, {target: {value: 'invalid URL'}});
                fireEvent.click(submitButton);
                await waitFor(() => {
                    expect(mockOnPlaylistSelect).not.toHaveBeenCalled();
                });
            });
            
            it('should show loading spinner during submission and hide it after completion', async () => {
                const mockOnPlaylistSelect = jest.fn(
                    (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 1000))
                );
                render(<PlaylistIdForm onPlaylistSelect={mockOnPlaylistSelect}/>, {
                    wrapper,
                });
                const inputElement = screen.getByPlaceholderText('Enter playlist URL');
                const submitButton = screen.getByRole('button', {name: /Submit/i});
                fireEvent.change(inputElement, {
                    target: {
                        value: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
                    },
                });
                fireEvent.click(submitButton);
                
                // スピナーが表示されるのを待つ
                await waitFor(() => {
                    expect(screen.getByRole('progressbar')).toBeInTheDocument();
                });
                
                // モック関数が呼ばれるのを待つ (つまり、送信が完了するのを待つ)
                await waitFor(() => {
                    expect(mockOnPlaylistSelect).toHaveBeenCalledWith(
                        '37i9dQZF1DXcBWIGoYBM5M'
                    );
                }, {timeout: 2000});
                
                // スピナーが非表示になるのを待つ
                await waitFor(() => {
                    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
                }, {timeout: 2000});
            });
        });
    });
        
        // エラーハンドリングのテスト
        describe('Error handling', () => {
            it('should handle errors during submission', async () => {
                const mockOnPlaylistSelect = jest.fn(
                    (): Promise<void> => Promise.reject(new Error('API Error'))
                );
                const consoleSpy = jest
                    .spyOn(console, 'error')
                    .mockImplementation(() => {
                    });
                render(<PlaylistIdForm onPlaylistSelect={mockOnPlaylistSelect}/>, {
                    wrapper,
                });
                const inputElement = screen.getByPlaceholderText('Enter playlist URL');
                const submitButton = screen.getByRole('button', {name: /Submit/i});
                fireEvent.change(inputElement, {
                    target: {
                        value: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
                    },
                });
                fireEvent.click(submitButton);
                await waitFor(() => {
                    expect(consoleSpy).toHaveBeenCalledWith(
                        'Error sending playlist ID:',
                        expect.any(Error)
                    );
                });
                consoleSpy.mockRestore();
            });
        });
    });
