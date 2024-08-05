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

// コンソールログのモック
console.log = jest.fn();
console.error = jest.fn();

describe('GET handler for followed playlists', () => {
    // テストごとにモックをリセット
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('should return playlists when API call is successful', async () => {
        const mockJwt = 'mock-jwt-token';
        const mockPlaylists = [{id: 1, name: 'Playlist 1'}, {id: 2, name: 'Playlist 2'}];
        
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockPlaylists),
        });
        
        const req = new NextRequest('http://localhost:3000/api/playlists/followed', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${mockJwt}`,
            },
        });
        
        await GET(req);
        
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
        expect(console.log).toHaveBeenCalledWith('GETハンドラーが呼び出されました');
        expect(console.log).toHaveBeenCalledWith('getFollowedPlaylists関数が呼び出されました');
        expect(console.log).toHaveBeenCalledWith('APIリクエストを送信します:', 'http://localhost:8080/api/playlists/followed');
        expect(console.log).toHaveBeenCalledWith('JWTトークン:', mockJwt);
        expect(console.log).toHaveBeenCalledWith('APIレスポンスを受信しました:', undefined);
        expect(console.log).toHaveBeenCalledWith('レスポンスデータ:', mockPlaylists);
        expect(console.log).toHaveBeenCalledWith('プレイリストの取得に成功しました:', mockPlaylists);
    });
    
    it('should handle API errors and return a 500 response', async () => {
        const mockJwt = 'mock-jwt-token';
        const mockError = new Error('API error');
        
        (global.fetch as jest.Mock).mockRejectedValue(mockError);
        
        const req = new NextRequest('http://localhost:3000/api/playlists/followed', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${mockJwt}`,
            },
        });
        
        await GET(req);
        
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
        expect(console.error).toHaveBeenCalledWith('APIリクエスト中にエラーが発生しました:', mockError);
        expect(console.error).toHaveBeenCalledWith('GETハンドラーでエラーが発生しました:', expect.any(Error));
    });
    
    it('should handle missing JWT token', async () => {
        const req = new NextRequest('http://localhost:3000/api/playlists/followed', {
            method: 'GET',
        });
        
        await GET(req);
        
        expect(global.fetch).not.toHaveBeenCalled();
        
        expect(NextResponse.json).toHaveBeenCalledWith(
            {error: 'フォロー中のプレイリストの取得中にエラーが発生しました: Failed to fetch playlists: Authorization header missing'},
            {status: 500}
        );
    });
    
    it('should use custom backend URL when environment variable is set', async () => {
        process.env.NEXT_PUBLIC_BACKEND_URL = 'https://custom-backend.com';
        
        const mockJwt = 'mock-jwt-token';
        const mockPlaylists = [{id: 1, name: 'Playlist 1'}];
        
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockPlaylists),
        });
        
        const req = new NextRequest('http://localhost:3000/api/playlists/followed', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${mockJwt}`,
            },
        });
        
        await GET(req);
        
        expect(global.fetch).toHaveBeenCalledWith(
            'https://custom-backend.com/api/playlists/followed',
            expect.objectContaining({
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${mockJwt}`,
                },
            })
        );
        
        delete process.env.NEXT_PUBLIC_BACKEND_URL;
    });
    
    it('should handle non-Error objects thrown', async () => {
        const mockJwt = 'mock-jwt-token';
        
        (global.fetch as jest.Mock).mockRejectedValue('Non-Error object');
        
        const req = new NextRequest('http://localhost:3000/api/playlists/followed', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${mockJwt}`,
            },
        });
        
        await GET(req);
        
        expect(NextResponse.json).toHaveBeenCalledWith(
            {error: 'フォロー中のプレイリストの取得中にエラーが発生しました: Failed to fetch playlists: Unknown error'},
            {status: 500}
        );
    });
    
    it('should handle API response that is not ok', async () => {
        const mockJwt = 'mock-jwt-token';
        
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 404,
        });
        
        const req = new NextRequest('http://localhost:3000/api/playlists/followed', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${mockJwt}`,
            },
        });
        
        await GET(req);
        
        expect(NextResponse.json).toHaveBeenCalledWith(
            {error: 'フォロー中のプレイリストの取得中にエラーが発生しました: Failed to fetch playlists: HTTP error! status: 404'},
            {status: 500}
        );
    });
    
    it('should handle unknown errors in GET handler', async () => {
        const mockJwt = 'mock-jwt-token';
        
        // getFollowedPlaylists関数内で未知のエラーをスローするようにモック
        (global.fetch as jest.Mock).mockRejectedValue('Unknown error');
        
        const req = new NextRequest('http://localhost:3000/api/playlists/followed', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${mockJwt}`,
            },
        });
        
        await GET(req);
        
        expect(NextResponse.json).toHaveBeenCalledWith(
            {error: 'フォロー中のプレイリストの取得中にエラーが発生しました: Failed to fetch playlists: Unknown error'},
            {status: 500}
        );
        expect(console.error).toHaveBeenCalledWith('APIリクエスト中にエラーが発生しました:', 'Unknown error');
        expect(console.error).toHaveBeenCalledWith('GETハンドラーでエラーが発生しました:', expect.any(Error));
    });
});
