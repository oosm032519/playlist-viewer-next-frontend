// app/api/playlists/search/route.ts

import {GET} from './route';
import {expect} from '@jest/globals';

// NextResponseをモックする
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((data, init) => {
            return {
                status: init?.status || 200,
                json: async () => data,
            };
        }),
    },
}));

// fetch関数をグローバルにモックする
global.fetch = jest.fn();

describe('GET /api/playlists/search', () => {
    // 各テストの前にモックをクリアする
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    /**
     * クエリパラメータが欠如している場合、400エラーを返すことを確認するテスト
     */
    it('should return 400 if query parameter is missing', async () => {
        const request = new Request('http://localhost:3000/api/playlists/search');
        const response = await GET(request);
        
        // ステータスコードが400であることを確認
        expect(response.status).toBe(400);
        const json = await response.json();
        // エラーメッセージが正しいことを確認
        expect(json).toEqual({error: 'Query parameter is required'});
    });
    
    /**
     * クエリパラメータが提供された場合、プレイリストデータを返すことを確認するテスト
     */
    it('should return playlists data when query parameter is provided', async () => {
        const mockData = {playlists: ['playlist1', 'playlist2']};
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });
        
        const request = new Request('http://localhost:3000/api/playlists/search?query=test&offset=0&limit=20');
        const response = await GET(request);
        
        // ステータスコードが200であることを確認
        expect(response.status).toBe(200);
        const json = await response.json();
        // 返されるデータが正しいことを確認
        expect(json).toEqual(mockData);
    });
    
    /**
     * fetchが失敗した場合、500エラーを返すことを確認するテスト
     */
    it('should return 500 if fetch fails', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
        });
        
        const request = new Request('http://localhost:3000/api/playlists/search?query=test&offset=0&limit=20');
        const response = await GET(request);
        
        // ステータスコードが500であることを確認
        expect(response.status).toBe(500);
        const json = await response.json();
        // エラーメッセージが正しいことを確認
        expect(json).toEqual({error: 'Internal Server Error'});
    });
    
    /**
     * fetchエラーを適切に処理することを確認するテスト
     */
    it('should handle fetch error', async () => {
        (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
        
        const request = new Request('http://localhost:3000/api/playlists/search?query=test&offset=0&limit=20');
        const response = await GET(request);
        
        // ステータスコードが500であることを確認
        expect(response.status).toBe(500);
        const json = await response.json();
        // エラーメッセージが正しいことを確認
        expect(json).toEqual({error: 'Internal Server Error'});
    });
});
