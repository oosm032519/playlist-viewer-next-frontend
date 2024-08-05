// app/api/playlists/remove-track/route.test.ts

import {POST} from './route';
import {NextRequest} from 'next/server';
import {expect} from '@jest/globals'

// 環境変数のモック
const originalEnv = process.env;

describe('POST /api/playlists/remove-track', () => {
    let mockFetch: jest.Mock;
    
    beforeEach(() => {
        // fetchのモック
        mockFetch = jest.fn();
        global.fetch = mockFetch;
        
        // 環境変数のリセット
        process.env = {...originalEnv};
        process.env.NEXT_PUBLIC_BACKEND_URL = 'http://test-backend.com';
    });
    
    afterEach(() => {
        jest.resetAllMocks();
        process.env = originalEnv;
    });
    
    it('正常にトラックを削除できること', async () => {
        const mockRequestBody = {playlistId: '123', trackId: '456'};
        const mockRequest = {
            json: jest.fn().mockResolvedValue(mockRequestBody),
            headers: {
                get: jest.fn().mockReturnValue('Bearer test-jwt-token')
            }
        } as unknown as NextRequest;
        
        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValue({message: 'Track removed successfully'}),
        });
        
        const response = await POST(mockRequest);
        const responseBody = await response.json();
        
        expect(response.status).toBe(200);
        expect(responseBody).toEqual({message: 'Track removed successfully'});
        expect(mockFetch).toHaveBeenCalledWith(
            'http://test-backend.com/api/playlist/remove-track',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer test-jwt-token',
                }),
                body: JSON.stringify(mockRequestBody),
            })
        );
    });
    
    it('バックエンドURLが設定されていない場合、デフォルトURLを使用すること', async () => {
        delete process.env.NEXT_PUBLIC_BACKEND_URL;
        
        const mockRequestBody = {playlistId: '123', trackId: '456'};
        const mockRequest = {
            json: jest.fn().mockResolvedValue(mockRequestBody),
            headers: {
                get: jest.fn().mockReturnValue('Bearer test-jwt-token')
            }
        } as unknown as NextRequest;
        
        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValue({}),
        });
        
        await POST(mockRequest);
        
        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/playlist/remove-track',
            expect.anything()
        );
    });
    
    it('バックエンドからエラーレスポンスが返された場合、適切にエラーハンドリングすること', async () => {
        const mockRequestBody = {playlistId: '123', trackId: '456'};
        const mockRequest = {
            json: jest.fn().mockResolvedValue(mockRequestBody),
            headers: {
                get: jest.fn().mockReturnValue('Bearer test-jwt-token')
            }
        } as unknown as NextRequest;
        
        mockFetch.mockResolvedValue({
            ok: false,
            status: 400,
            json: jest.fn().mockResolvedValue({error: 'Invalid request'}),
        });
        
        const response = await POST(mockRequest);
        const responseBody = await response.json();
        
        expect(response.status).toBe(400);
        expect(responseBody).toEqual({
            error: "トラックの削除に失敗しました",
            details: {error: 'Invalid request'},
        });
    });
    
    it('ネットワークエラーが発生した場合、適切にエラーハンドリングすること', async () => {
        const mockRequestBody = {playlistId: '123', trackId: '456'};
        const mockRequest = {
            json: jest.fn().mockResolvedValue(mockRequestBody),
            headers: {
                get: jest.fn().mockReturnValue('Bearer test-jwt-token')
            }
        } as unknown as NextRequest;
        
        mockFetch.mockRejectedValue(new Error('Network error'));
        
        const response = await POST(mockRequest);
        const responseBody = await response.json();
        
        expect(response.status).toBe(500);
        expect(responseBody).toEqual({
            error: "トラックの削除に失敗しました",
            details: "不明なエラー",
        });
    });
    
    it('JWTが見つからない場合、401エラーを返すこと', async () => {
        const mockRequestBody = {playlistId: '123', trackId: '456'};
        const mockRequest = {
            json: jest.fn().mockResolvedValue(mockRequestBody),
            headers: {
                get: jest.fn().mockReturnValue(null)
            }
        } as unknown as NextRequest;
        
        const response = await POST(mockRequest);
        const responseBody = await response.json();
        
        expect(response.status).toBe(401);
        expect(responseBody).toEqual({
            error: "JWTが見つかりません"
        });
    });
});
