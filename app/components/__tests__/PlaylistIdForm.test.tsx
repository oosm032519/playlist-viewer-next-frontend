// PlaylistIdForm.test.tsx
"use client";

import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {axe, toHaveNoViolations} from 'jest-axe';
import PlaylistIdForm from '../PlaylistIdForm';
import LoadingSpinner from '@/app/components/LoadingSpinner';

expect.extend(toHaveNoViolations);

describe('PlaylistIdForm', () => {
    // モック関数の型を明示的に定義
    const createMockOnPlaylistSelect = (): jest.Mock<Promise<void>, [string]> =>
        jest.fn((playlistId: string) => Promise.resolve());
    
    // アクセシビリティテスト
    it('should not have any accessibility violations', async () => {
        const {container} = render(<PlaylistIdForm onPlaylistSelect={createMockOnPlaylistSelect()}/>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    // 入力フィールドのテスト
    describe('Input field', () => {
        it('should be visible and enabled', () => {
            render(<PlaylistIdForm onPlaylistSelect={createMockOnPlaylistSelect()}/>);
            const inputElement = screen.getByPlaceholderText('Enter playlist URL');
            expect(inputElement).toBeInTheDocument();
            expect(inputElement).toBeEnabled();
        });
        
        it('should update value when user types', () => {
            render(<PlaylistIdForm onPlaylistSelect={function (playlistId: string): Promise<void> {
                throw new Error('Function not implemented.');
            }}/>);
            const inputElement = screen.getByPlaceholderText('Enter playlist URL') as HTMLInputElement;
            fireEvent.change(inputElement, {target: {value: 'https://open.spotify.com/playlist/123'}});
            expect(inputElement.value).toBe('https://open.spotify.com/playlist/123');
        });
    });
    
    // 送信ボタンのテスト
    describe('Submit button', () => {
        it('should be visible and enabled initially', () => {
            render(<PlaylistIdForm onPlaylistSelect={createMockOnPlaylistSelect()}/>);
            const submitButton = screen.getByRole('button', {name: /Submit/i});
            expect(submitButton).toBeInTheDocument();
            expect(submitButton).toBeEnabled();
        });
        
        it('should be disabled during form submission', async () => {
            const mockOnPlaylistSelect = jest.fn(
                () => new Promise<void>((resolve) => setTimeout(resolve, 1000))
            );
            render(<PlaylistIdForm onPlaylistSelect={mockOnPlaylistSelect}/>);
            const inputElement = screen.getByPlaceholderText('Enter playlist URL');
            const submitButton = screen.getByRole('button', {name: /Submit/i});
            
            fireEvent.change(inputElement, {target: {value: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M'}});
            fireEvent.click(submitButton);
            
            expect(submitButton).toBeDisabled();
            
            await waitFor(() => {
                expect(submitButton).toBeEnabled();
            }, {timeout: 2000});
        });
    });
    
    // フォーム送信のテスト
    describe('Form submission', () => {
        it('should call onPlaylistSelect with correct ID for valid URL', async () => {
            const mockOnPlaylistSelect = createMockOnPlaylistSelect();
            render(<PlaylistIdForm onPlaylistSelect={mockOnPlaylistSelect}/>);
            const inputElement = screen.getByPlaceholderText('Enter playlist URL');
            const submitButton = screen.getByRole('button', {name: /Submit/i});
            
            fireEvent.change(inputElement, {target: {value: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M'}});
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                expect(mockOnPlaylistSelect).toHaveBeenCalledWith('37i9dQZF1DXcBWIGoYBM5M');
            });
        });
        
        // フォーム送信のテスト
        describe('Form submission', () => {
            it('should call onPlaylistSelect with correct ID for valid URL', async () => {
                const mockOnPlaylistSelect = jest.fn();
                render(<PlaylistIdForm onPlaylistSelect={mockOnPlaylistSelect}/>);
                const inputElement = screen.getByPlaceholderText('Enter playlist URL');
                const submitButton = screen.getByRole('button', {name: /Submit/i});
                
                fireEvent.change(inputElement, {target: {value: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M'}});
                fireEvent.click(submitButton);
                
                await waitFor(() => {
                    expect(mockOnPlaylistSelect).toHaveBeenCalledWith('37i9dQZF1DXcBWIGoYBM5M');
                });
            });
            
            it('should not call onPlaylistSelect for invalid URL', async () => {
                const mockOnPlaylistSelect = jest.fn();
                render(<PlaylistIdForm onPlaylistSelect={mockOnPlaylistSelect}/>);
                const inputElement = screen.getByPlaceholderText('Enter playlist URL');
                const submitButton = screen.getByRole('button', {name: /Submit/i});
                
                fireEvent.change(inputElement, {target: {value: 'invalid URL'}});
                fireEvent.click(submitButton);
                
                await waitFor(() => {
                    expect(mockOnPlaylistSelect).not.toHaveBeenCalled();
                });
            });
            
            it('should show loading spinner during submission and hide it after completion', async () => {
                // モック関数を作成し、1秒後に解決するPromiseを返すようにします
                const mockOnPlaylistSelect = jest.fn(() =>
                    new Promise<void>((resolve) => setTimeout(resolve, 1000))
                );
                
                // コンポーネントをレンダリング
                render(<PlaylistIdForm onPlaylistSelect={mockOnPlaylistSelect}/>);
                
                const inputElement = screen.getByPlaceholderText('Enter playlist URL');
                const submitButton = screen.getByRole('button', {name: /Submit/i});
                
                // 有効なプレイリストURLを入力
                fireEvent.change(inputElement, {target: {value: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M'}});
                
                // フォームを送信
                fireEvent.click(submitButton);
                
                // ローディングスピナーが表示されることを確認
                await waitFor(() => {
                    expect(screen.getByRole('progressbar', {hidden: true})).toBeInTheDocument();
                });
                
                // モック関数の解決を待つ
                await waitFor(() => {
                    expect(mockOnPlaylistSelect).toHaveBeenCalledWith('37i9dQZF1DXcBWIGoYBM5M');
                }, {timeout: 2000});
                
                // ローディングスピナーが非表示になることを確認
                await waitFor(() => {
                    const spinner = screen.getByRole('progressbar', {hidden: true});
                    expect(spinner).toHaveStyle('display: none');
                });
            });
            
            // エラーハンドリングのテスト
            describe('Error handling', () => {
                it('should handle errors during submission', async () => {
                    const mockOnPlaylistSelect = jest.fn(() => Promise.reject(new Error('API Error')));
                    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
                    });
                    
                    render(<PlaylistIdForm onPlaylistSelect={mockOnPlaylistSelect}/>);
                    const inputElement = screen.getByPlaceholderText('Enter playlist URL');
                    const submitButton = screen.getByRole('button', {name: /Submit/i});
                    
                    fireEvent.change(inputElement, {target: {value: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M'}});
                    fireEvent.click(submitButton);
                    
                    await waitFor(() => {
                        expect(consoleSpy).toHaveBeenCalledWith('Error sending playlist ID:', expect.any(Error));
                    });
                    
                    consoleSpy.mockRestore();
                });
            });
        });
    })
})
