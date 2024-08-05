import {NextRequest, NextResponse} from 'next/server';
import {GET} from './route';
import {expect} from '@jest/globals';

// モックの設定
jest.mock('next/server', () => ({
    NextRequest: jest.fn().mockImplementation((input, init) => ({
        url: input,
        method: init?.method,
        headers: new Map(Object.entries(init?.headers || {})),
    })),
    NextResponse: {
        json: jest.fn(),
    },
}));

// グローバルなfetch関数をモック
global.fetch = jest.fn();

describe('GET handler for followed playlists', () => {
    // テストごとにモックをリセット
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('should return playlists when API call is successful', async () => {
        // モックの設定
        const mockJwt = 'mock-jwt-token';
        const mockPlaylists = [{id: 1, name: 'Playlist 1'}, {id: 2, name: 'Playlist 2'}];
        
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockPlaylists),
        });
        
        // リクエストオブジェクトの作成
        const req = new NextRequest('http://localhost:3000/api/playlists/followed', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${mockJwt}`,
            },
        });
        
        // ハンドラーの呼び出し
        const response = await GET(req);
        
        // アサーション
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/playlists/followed',
            expect.objectContaining({
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${mockJwt}`,
                },
            })
        );
        
        expect(NextResponse.json).toHaveBeenCalledWith(mockPlaylists);
    });
    
    it('should handle API errors and return a 500 response', async () => {
        // モックの設定
        const mockJwt = 'mock-jwt-token';
        const mockError = new Error('API error');
        
        (global.fetch as jest.Mock).mockRejectedValue(mockError);
        
        // リクエストオブジェクトの作成
        const req = new NextRequest('http://localhost:3000/api/playlists/followed', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${mockJwt}`,
            },
        });
        
        // ハンドラーの呼び出し
        const response = await GET(req);
        
        // アサーション
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/playlists/followed',
            expect.objectContaining({
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${mockJwt}`,
                },
            })
        );
        
        expect(NextResponse.json).toHaveBeenCalledWith(
            {error: 'フォロー中のプレイリストの取得中にエラーが発生しました: Failed to fetch playlists: API error'},
            {status: 500}
        );
    });
    
    it('should handle missing JWT token', async () => {
        // リクエストオブジェクトの作成
        const req = new NextRequest('http://localhost:3000/api/playlists/followed', {
            method: 'GET',
        });
        
        // ハンドラーの呼び出し
        const response = await GET(req);
        
        // アサーション
        expect(global.fetch).not.toHaveBeenCalled();
        
        expect(NextResponse.json).toHaveBeenCalledWith(
            {error: 'フォロー中のプレイリストの取得中にエラーが発生しました: Failed to fetch playlists: Authorization header missing'},
            {status: 500}
        );
    });
    
    it('should use custom backend URL when environment variable is set', async () => {
        // 環境変数の設定
        process.env.NEXT_PUBLIC_BACKEND_URL = 'https://custom-backend.com';
        
        // モックの設定
        const mockJwt = 'mock-jwt-token';
        const mockPlaylists = [{id: 1, name: 'Playlist 1'}];
        
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockPlaylists),
        });
        
        // リクエストオブジェクトの作成
        const req = new NextRequest('http://localhost:3000/api/playlists/followed', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${mockJwt}`,
            },
        });
        
        // ハンドラーの呼び出し
        const response = await GET(req);
        
        // アサーション
        expect(global.fetch).toHaveBeenCalledWith(
            'https://custom-backend.com/api/playlists/followed',
            expect.objectContaining({
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${mockJwt}`,
                },
            })
        );
        
        // 環境変数をリセット
        delete process.env.NEXT_PUBLIC_BACKEND_URL;
    });
});
