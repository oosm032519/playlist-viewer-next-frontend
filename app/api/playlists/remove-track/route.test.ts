// app/api/playlists/remove-track/route.test.ts

import {NextRequest} from 'next/server';
import {POST} from './route';
import {expect} from '@jest/globals';

// グローバルなfetch関数をモックとして設定
global.fetch = jest.fn();

describe('POST /api/playlists/remove-track', () => {
    // 各テストの前にモックをクリア
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    /**
     * プレイリストからトラックを正常に削除できることをテスト
     */
    it('should remove track from playlist successfully', async () => {
        // モックリクエストの作成
        const mockRequest = new NextRequest('http://localhost/api/playlists/remove-track', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'cookie': 'test-cookie',
            }),
            body: JSON.stringify({playlistId: '123', trackId: '456'}),
        });
        
        // モックレスポンスの作成
        const mockResponse = {
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValue({success: true}),
        };
        
        // fetch関数のモックを設定
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
        
        // POST関数を呼び出し
        const response = await POST(mockRequest);
        
        // fetch関数が正しい引数で呼び出されたことを確認
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/playlist/remove-track',
            expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': 'test-cookie',
                },
                body: JSON.stringify({playlistId: '123', trackId: '456'}),
                credentials: 'include',
            })
        );
        
        // レスポンスのステータスが200であることを確認
        expect(response.status).toBe(200);
        
        // レスポンスのデータが期待通りであることを確認
        const responseData = await response.json();
        expect(responseData).toEqual({success: true});
    });
    
    /**
     * エラーが正しく処理されることをテスト
     */
    it('should handle errors correctly', async () => {
        // モックリクエストの作成
        const mockRequest = new NextRequest('http://localhost/api/playlists/remove-track', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify({playlistId: '123', trackId: '456'}),
        });
        
        // モックエラーレスポンスの作成
        const mockErrorResponse = {
            ok: false,
            status: 500,
            json: jest.fn().mockResolvedValue({error: 'Internal Server Error'}),
        };
        
        // fetch関数のモックを設定
        (global.fetch as jest.Mock).mockResolvedValue(mockErrorResponse);
        
        // POST関数を呼び出し
        const response = await POST(mockRequest);
        
        // fetch関数が正しい引数で呼び出されたことを確認
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/playlist/remove-track',
            expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': '',
                },
                body: JSON.stringify({playlistId: '123', trackId: '456'}),
                credentials: 'include',
            })
        );
        
        // レスポンスのステータスが500であることを確認
        expect(response.status).toBe(500);
        
        // レスポンスのデータが期待通りであることを確認
        const responseData = await response.json();
        expect(responseData).toEqual({
            error: 'Failed to remove track from playlist',
            details: {error: 'Internal Server Error'},
        });
    });
});
