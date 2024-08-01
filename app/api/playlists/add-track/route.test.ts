import {NextRequest} from 'next/server';
import {POST} from './route';
import {cookies} from 'next/headers';
import {expect} from '@jest/globals';

// モックの設定
jest.mock('next/headers', () => ({
    cookies: jest.fn(),
}));

// グローバルなfetchのモック
global.fetch = jest.fn();

describe('POST /api/playlists/add-track', () => {
    // テストごとにモックをリセット
    beforeEach(() => {
        jest.resetAllMocks();
        console.log = jest.fn();
        console.error = jest.fn();
    });
    
    // 環境変数の設定
    const originalEnv = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env = {...originalEnv};
    });
    afterAll(() => {
        process.env = originalEnv;
    });
    
    it('正常系: トラックをプレイリストに追加できること', async () => {
        // モックの設定
        const mockRequest = {
            json: jest.fn().mockResolvedValue({playlistId: '1', trackId: '2'}),
        } as unknown as NextRequest;
        
        (cookies as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue({value: 'mock-jwt-token'}),
        });
        
        (global.fetch as jest.Mock).mockResolvedValue({
            status: 200,
            json: jest.fn().mockResolvedValue({message: 'Track added successfully'}),
        });
        
        // テスト実行
        const response = await POST(mockRequest);
        const responseBody = await response.json();
        
        // アサーション
        expect(response.status).toBe(200);
        expect(responseBody).toEqual({message: 'Track added successfully'});
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/playlist/add-track',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                    'Cookie': 'JWT=mock-jwt-token',
                }),
                body: JSON.stringify({playlistId: '1', trackId: '2'}),
            })
        );
    });
    
    it('異常系: バックエンドAPIがエラーを返した場合', async () => {
        // モックの設定
        const mockRequest = {
            json: jest.fn().mockResolvedValue({playlistId: '1', trackId: '2'}),
        } as unknown as NextRequest;
        
        (cookies as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue({value: 'mock-jwt-token'}),
        });
        
        (global.fetch as jest.Mock).mockResolvedValue({
            status: 400,
            json: jest.fn().mockResolvedValue({error: 'Invalid playlist ID'}),
        });
        
        // テスト実行
        const response = await POST(mockRequest);
        const responseBody = await response.json();
        
        // アサーション
        expect(response.status).toBe(400);
        expect(responseBody).toEqual({error: 'Invalid playlist ID'});
    });
    
    it('異常系: リクエストのJSONパースに失敗した場合', async () => {
        // モックの設定
        const mockRequest = {
            json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
        } as unknown as NextRequest;
        
        // テスト実行
        const response = await POST(mockRequest);
        const responseBody = await response.json();
        
        // アサーション
        expect(response.status).toBe(500);
        expect(responseBody).toEqual({
            error: 'プレイリストへのトラック追加に失敗しました',
            details: 'Invalid JSON',
        });
    });
    
    it('環境変数BACKEND_URLが設定されている場合、そのURLを使用すること', async () => {
        // 環境変数の設定
        process.env.BACKEND_URL = 'https://api.example.com';
        
        // モックの設定
        const mockRequest = {
            json: jest.fn().mockResolvedValue({playlistId: '1', trackId: '2'}),
        } as unknown as NextRequest;
        
        (cookies as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue({value: 'mock-jwt-token'}),
        });
        
        (global.fetch as jest.Mock).mockResolvedValue({
            status: 200,
            json: jest.fn().mockResolvedValue({message: 'Track added successfully'}),
        });
        
        // テスト実行
        await POST(mockRequest);
        
        // アサーション
        expect(global.fetch).toHaveBeenCalledWith(
            'https://api.example.com/api/playlist/add-track',
            expect.anything()
        );
    });
});
