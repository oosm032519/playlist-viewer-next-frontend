// app/api/playlists/create/route.test.ts

import {NextRequest} from 'next/server';
import {POST} from './route';
import fetchMock from 'jest-fetch-mock';
import {expect} from '@jest/globals';

// fetchMockを有効化する
fetchMock.enableMocks();

describe('POST /api/playlists/create', () => {
    // 各テストの前にモックをリセットする
    beforeEach(() => {
        fetchMock.resetMocks();
        // コンソールエラーをモック化
        jest.spyOn(console, 'error').mockImplementation(() => {
        });
    });
    
    afterEach(() => {
        // コンソールエラーのモックをリセット
        jest.restoreAllMocks();
    });
    
    it('should create a playlist successfully', async () => {
        // 成功レスポンスのモック設定
        const mockResponse = {success: true, playlistId: '12345'};
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {status: 200});
        
        // リクエストデータの設定
        const trackIds = ['track1', 'track2', 'track3'];
        const request = new NextRequest('http://localhost:3000/api/playlists/create', {
            method: 'POST',
            body: JSON.stringify(trackIds),
            headers: {
                'Content-Type': 'application/json',
                'cookie': 'sessionId=abc123'
            }
        });
        
        // POST関数の呼び出しとレスポンスの取得
        const response = await POST(request);
        
        // レスポンスのステータスコードを検証
        expect(response.status).toBe(200);
        // レスポンスデータの検証
        const responseData = await response.json();
        expect(responseData).toEqual(mockResponse);
    });
    
    it('should handle backend errors gracefully', async () => {
        // エラーレスポンスのモック設定
        fetchMock.mockResponseOnce('Internal Server Error', {status: 500});
        
        // リクエストデータの設定
        const trackIds = ['track1', 'track2', 'track3'];
        const request = new NextRequest('http://localhost:3000/api/playlists/create', {
            method: 'POST',
            body: JSON.stringify(trackIds),
            headers: {
                'Content-Type': 'application/json',
                'cookie': 'sessionId=abc123'
            }
        });
        
        // POST関数の呼び出しとレスポンスの取得
        const response = await POST(request);
        
        // エラーレスポンスのステータスコードを検証
        expect(response.status).toBe(500);
        // エラーレスポンスデータの検証
        const responseData = await response.json();
        expect(responseData).toEqual({
            error: 'Failed to create playlist',
            details: 'HTTP error! status: 500'
        });
    });
    
    it('should handle unexpected errors gracefully', async () => {
        // 予期しないエラーレスポンスのモック設定
        fetchMock.mockRejectOnce(new Error('Unexpected error'));
        
        // リクエストデータの設定
        const trackIds = ['track1', 'track2', 'track3'];
        const request = new NextRequest('http://localhost:3000/api/playlists/create', {
            method: 'POST',
            body: JSON.stringify(trackIds),
            headers: {
                'Content-Type': 'application/json',
                'cookie': 'sessionId=abc123'
            }
        });
        
        // POST関数の呼び出しとレスポンスの取得
        const response = await POST(request);
        
        // エラーレスポンスのステータスコードを検証
        expect(response.status).toBe(500);
        // エラーレスポンスデータの検証
        const responseData = await response.json();
        expect(responseData).toEqual({
            error: 'Failed to create playlist',
            details: 'Unexpected error'
        });
    });
    
    it('should handle unknown errors gracefully', async () => {
        // 未知のエラーをシミュレート
        fetchMock.mockRejectOnce(() => Promise.reject({} as Error));
        
        // リクエストデータの設定
        const trackIds = ['track1', 'track2', 'track3'];
        const request = new NextRequest('http://localhost:3000/api/playlists/create', {
            method: 'POST',
            body: JSON.stringify(trackIds),
            headers: {
                'Content-Type': 'application/json',
                'cookie': 'sessionId=abc123'
            }
        });
        
        // POST関数の呼び出しとレスポンスの取得
        const response = await POST(request);
        
        // エラーレスポンスのステータスコードを検証
        expect(response.status).toBe(500);
        // エラーレスポンスデータの検証
        const responseData = await response.json();
        expect(responseData).toEqual({
            error: 'Failed to create playlist',
            details: 'Unknown error'
        });
        
        // コンソールエラーが呼び出されたことを確認
        expect(console.error).toHaveBeenCalledWith('Unknown error:', {});
    });
});
