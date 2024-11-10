// app/components/PlaylistIdForm.test.tsx

"use client";

import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {axe, toHaveNoViolations} from 'jest-axe';
import PlaylistIdForm from '@/app/components/PlaylistIdForm';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {expect} from '@jest/globals';

expect.extend(toHaveNoViolations);

// React Query のモックセットアップ
const queryClient = new QueryClient();
const wrapper = ({children}: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('PlaylistIdForm', () => {
    /**
     * モック関数の型を明示的に定義
     * @returns {jest.Mock<Promise<void>, [string]>} - プレイリストIDを受け取り、Promiseを返すモック関数
     */
    const createMockOnPlaylistSelect = (): jest.Mock<Promise<void>, [string]> =>
        jest.fn((playlistId: string) => Promise.resolve());
    
    /**
     * アクセシビリティテスト
     * @description コンポーネントがアクセシビリティ違反を持たないことを確認する
     */
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
        /**
         * 入力フィールドが表示され、有効であることを確認するテスト
         */
        it('should be visible and enabled', () => {
            const mockOnPlaylistSelect = createMockOnPlaylistSelect();
            render(<PlaylistIdForm onPlaylistSelect={mockOnPlaylistSelect}/>, {
                wrapper,
            });
            const inputElement = screen.getByPlaceholderText('Enter playlist URL');
            expect(inputElement).toBeInTheDocument();
            expect(inputElement).toBeEnabled();
        });
        
        /**
         * ユーザーが入力したときに値が更新されることを確認するテスト
         */
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
        /**
         * 送信ボタンが初期状態で表示され、有効であることを確認するテスト
         */
        it('should be visible and enabled initially', () => {
            const mockOnPlaylistSelect = createMockOnPlaylistSelect();
            render(<PlaylistIdForm onPlaylistSelect={mockOnPlaylistSelect}/>, {
                wrapper,
            });
            const submitButton = screen.getByRole('button', {name: /Submit/i});
            expect(submitButton).toBeInTheDocument();
            expect(submitButton).toBeEnabled();
        });
        
        /**
         * フォーム送信中に送信ボタンが無効化されることを確認するテスト
         */
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
            /**
             * 有効なURLの場合、onPlaylistSelectが正しいIDで呼び出されることを確認するテスト
             */
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
            
            /**
             * 無効なURLの場合、onPlaylistSelectが呼び出されないことを確認するテスト
             */
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
            
            /**
             * 送信中にローディングスピナーが表示され、完了後に非表示になることを確認するテスト
             */
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
        /**
         * 送信中にエラーが発生した場合の処理を確認するテスト
         */
        it('should handle errors during submission', async () => {
            const mockOnPlaylistSelect = jest.fn(
                (): Promise<void> => Promise.reject(new Error('API Error'))
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
        });
    });
});
