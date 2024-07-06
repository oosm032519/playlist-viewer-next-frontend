// app/api/playlists/remove-track/route.test.ts

import {POST} from './route';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {NextRequest} from 'next/server';
import {expect} from '@jest/globals';

// axios のモックを作成
const mock = new MockAdapter(axios);

// 環境変数のモック
process.env.BACKEND_URL = 'http://mockbackend.com';

describe('POST /api/playlists/remove-track', () => {
    afterEach(() => {
        mock.reset();
    });
    
    it('正常にトラックをプレイリストから削除できること', async () => {
        const mockResponse = {message: 'Track removed successfully'};
        mock.onPost('http://mockbackend.com/api/playlist/remove-track').reply(200, mockResponse);
        
        const mockRequest = {
            json: jest.fn().mockResolvedValue({playlistId: '123', trackId: '456'}),
            headers: {
                get: jest.fn().mockReturnValue('mock-cookie'),
            },
        } as unknown as NextRequest;
        
        const response = await POST(mockRequest);
        const responseData = await response.json();
        
        expect(response.status).toBe(200);
        expect(responseData).toEqual(mockResponse);
    });
    
    it('バックエンドAPIがエラーを返した場合、適切にエラーハンドリングされること', async () => {
        mock.onPost('http://mockbackend.com/api/playlist/remove-track').reply(500, {error: 'Internal Server Error'});
        
        const mockRequest = {
            json: jest.fn().mockResolvedValue({playlistId: '123', trackId: '456'}),
            headers: {
                get: jest.fn().mockReturnValue('mock-cookie'),
            },
        } as unknown as NextRequest;
        
        const response = await POST(mockRequest);
        const responseData = await response.json();
        
        expect(response.status).toBe(500);
        expect(responseData).toHaveProperty('error');
        expect(responseData.error).toBe('Failed to remove track from playlist');
    });
    
    it('リクエストのJSONパースに失敗した場合、適切にエラーハンドリングされること', async () => {
        const mockRequest = {
            json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
            headers: {
                get: jest.fn().mockReturnValue('mock-cookie'),
            },
        } as unknown as NextRequest;
        
        const response = await POST(mockRequest);
        const responseData = await response.json();
        
        expect(response.status).toBe(500);
        expect(responseData).toHaveProperty('error');
        expect(responseData.error).toBe('Failed to remove track from playlist');
    });
});
