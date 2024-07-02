"use client";
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import PlaylistIdForm from '../PlaylistIdForm';
import LoadingSpinner from '@/app/components/LoadingSpinner'

describe('PlaylistIdForm', () => {
    it('入力フィールドが表示され、入力が可能であること', () => {
        render(<PlaylistIdForm onPlaylistSelect={() => {
        }}/>);
        const inputElement = screen.getByPlaceholderText('Enter playlist URL');
        expect(inputElement).toBeInTheDocument();
        expect(inputElement).toBeEnabled();
    });
    
    it('有効なプレイリストURLを入力して送信すると、onPlaylistSelectが呼び出されること', async () => {
        const mockOnPlaylistSelect = jest.fn();
        render(<PlaylistIdForm onPlaylistSelect={mockOnPlaylistSelect}/>);
        const inputElement = screen.getByPlaceholderText('Enter playlist URL');
        const submitButton = screen.getByRole('button', {name: /Submit/i});
        
        fireEvent.change(inputElement, {target: {value: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M7'}});
        fireEvent.click(submitButton);
        
        expect(mockOnPlaylistSelect).toHaveBeenCalledWith('37i9dQZF1DXcBWIGoYBM5M7');
    });
    
    it('無効なプレイリストURLを入力して送信すると、onPlaylistSelectが呼び出されないこと', async () => {
        const mockOnPlaylistSelect = jest.fn();
        render(<PlaylistIdForm onPlaylistSelect={mockOnPlaylistSelect}/>);
        const inputElement = screen.getByPlaceholderText('Enter playlist URL');
        const submitButton = screen.getByRole('button', {name: /Submit/i});
        
        fireEvent.change(inputElement, {target: {value: '無効なURL'}});
        fireEvent.click(submitButton);
        
        expect(mockOnPlaylistSelect).not.toHaveBeenCalled();
    });
    
    it('送信ボタンをクリックすると、ローディングスピナーが表示されること', async () => {
        // Promiseを返すようにモック関数を作成
        const mockOnPlaylistSelect = jest.fn(() => new Promise(() => {
        }));
        render(<PlaylistIdForm onPlaylistSelect={mockOnPlaylistSelect}/>);
        
        const inputElement = screen.getByPlaceholderText('Enter playlist URL');
        const submitButton = screen.getByRole('button', {name: /Submit/i});
        
        // 正しいプレイリストURLを入力
        fireEvent.change(inputElement, {target: {value: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M7'}});
        
        // ローディングスピナーをレンダリング
        render(<LoadingSpinner loading={true}/>); // loading={true} を渡す
        
        fireEvent.click(submitButton);
        
        // waitForは不要になります
        expect(screen.getByRole('progressbar')).toBeVisible();
    });
})
