// app/api/playlists/[id]/route.ts.test.ts

import {GET} from './route';
import fetchMock from 'jest-fetch-mock';
import {expect} from '@jest/globals';

// fetchMockを有効にする
fetchMock.enableMocks();

// next/serverモジュールをモックする
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((data, init) => {
            return {
                json: async () => data,
                status: init.status,
            };
        }),
    },
}));

// GET /api/playlists/[id] エンドポイントのテストを定義
describe('GET /api/playlists/[id]', () => {
    // 各テストの前にfetchMockをリセットする
    beforeEach(() => {
        fetchMock.resetMocks();
    });
    
    // リクエストが成功した場合、プレイリストデータを返すことを確認するテスト
    it('should return playlist data when the request is successful', async () => {
        const mockData = {id: '1', name: 'My Playlist'};
        fetchMock.mockResponseOnce(JSON.stringify(mockData), {status: 200});
        
        const request = new Request('http://localhost:3000/api/playlists/1');
        const params = {params: {id: '1'}};
        
        const response = await GET(request, params);
        const json = await response.json();
        
        expect(response.status).toBe(200);
        expect(json).toEqual(mockData);
    });
    
    // プレイリストが見つからない場合、404を返すことを確認するテスト
    it('should return 404 when the playlist is not found', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({error: 'Not Found'}), {status: 404});
        
        const request = new Request('http://localhost:3000/api/playlists/1');
        const params = {params: {id: '1'}};
        
        const response = await GET(request, params);
        const json = await response.json();
        
        expect(response.status).toBe(404);
        expect(json).toEqual({error: 'プレイリストが見つかりません'});
    });
    
    // サーバーエラーが発生した場合、500を返すことを確認するテスト
    it('should return 500 when there is a server error', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({error: 'Server Error'}), {status: 500});
        
        const request = new Request('http://localhost:3000/api/playlists/1');
        const params = {params: {id: '1'}};
        
        const response = await GET(request, params);
        const json = await response.json();
        
        expect(response.status).toBe(500);
        expect(json).toEqual({error: 'プレイリストの取得中にサーバーエラーが発生しました'});
    });
    
    // 予期せぬエラーが発生した場合、500を返すことを確認するテスト
    it('should return 500 for unexpected errors', async () => {
        fetchMock.mockRejectOnce(new Error('Unexpected Error'));
        
        const request = new Request('http://localhost:3000/api/playlists/1');
        const params = {params: {id: '1'}};
        
        const response = await GET(request, params);
        const json = await response.json();
        
        expect(response.status).toBe(500);
        expect(json).toEqual({error: 'プレイリストの取得中に予期せぬエラーが発生しました'});
    });
});
