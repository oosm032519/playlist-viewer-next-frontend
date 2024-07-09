// __tests__/app/api/playlists/create/route.test.ts

import {NextRequest} from 'next/server';
import {POST} from './route';
import fetchMock from 'jest-fetch-mock';
import {expect} from '@jest/globals';

fetchMock.enableMocks();

describe('POST /api/playlists/create', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });
    
    it('should create a playlist successfully', async () => {
        // モックレスポンスの設定
        const mockResponse = {success: true, playlistId: '12345'};
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {status: 200});
        
        // モックリクエストの設定
        const trackIds = ['track1', 'track2', 'track3'];
        const request = new NextRequest('http://localhost:3000/api/playlists/create', {
            method: 'POST',
            body: JSON.stringify(trackIds),
            headers: {
                'Content-Type': 'application/json',
                'cookie': 'sessionId=abc123'
            }
        });
        
        // POST関数の呼び出し
        const response = await POST(request);
        
        // レスポンスの検証
        expect(response.status).toBe(200);
        const responseData = await response.json();
        expect(responseData).toEqual(mockResponse);
    });
    
    it('should handle backend errors gracefully', async () => {
        // モックレスポンスの設定
        fetchMock.mockResponseOnce('Internal Server Error', {status: 500});
        
        // モックリクエストの設定
        const trackIds = ['track1', 'track2', 'track3'];
        const request = new NextRequest('http://localhost:3000/api/playlists/create', {
            method: 'POST',
            body: JSON.stringify(trackIds),
            headers: {
                'Content-Type': 'application/json',
                'cookie': 'sessionId=abc123'
            }
        });
        
        // POST関数の呼び出し
        const response = await POST(request);
        
        // エラーレスポンスの検証
        expect(response.status).toBe(500);
        const responseData = await response.json();
        expect(responseData).toEqual({
            error: 'Failed to create playlist',
            details: 'HTTP error! status: 500'
        });
    });
    
    it('should handle unexpected errors gracefully', async () => {
        // モックレスポンスの設定
        fetchMock.mockRejectOnce(new Error('Unexpected error'));
        
        // モックリクエストの設定
        const trackIds = ['track1', 'track2', 'track3'];
        const request = new NextRequest('http://localhost:3000/api/playlists/create', {
            method: 'POST',
            body: JSON.stringify(trackIds),
            headers: {
                'Content-Type': 'application/json',
                'cookie': 'sessionId=abc123'
            }
        });
        
        // POST関数の呼び出し
        const response = await POST(request);
        
        // エラーレスポンスの検証
        expect(response.status).toBe(500);
        const responseData = await response.json();
        expect(responseData).toEqual({
            error: 'Failed to create playlist',
            details: 'Unexpected error'
        });
    });
});
