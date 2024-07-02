// app/api/playlists/[id]/route.test.ts

import {NextRequest} from 'next/server';
import {GET} from './route';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('GET function', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        process.env.BACKEND_URL = 'http://test-backend.com';
    });
    
    it('正常なレスポンスを処理できること', async () => {
        const mockPlaylistData = {id: '123', name: 'Test Playlist'};
        fetchMock.mockResponseOnce(JSON.stringify(mockPlaylistData));
        
        const request = new NextRequest('http://localhost:3000/api/playlists/123');
        const response = await GET(request, {params: {id: '123'}});
        const responseData = await response.json();
        
        expect(response.status).toBe(200);
        expect(responseData).toEqual(mockPlaylistData);
        expect(fetchMock).toHaveBeenCalledWith('http://test-backend.com/api/playlists/123');
    });
    
    it('バックエンドAPIのエラーを適切に処理できること', async () => {
        fetchMock.mockRejectOnce(new Error('Network error'));
        
        const request = new NextRequest('http://localhost:3000/api/playlists/123');
        const response = await GET(request, {params: {id: '123'}});
        const responseData = await response.json();
        
        expect(response.status).toBe(500);
        expect(responseData).toEqual({error: "プレイリストの取得に失敗しました"});
    });
    
    it('無効なJSONレスポンスを適切に処理できること', async () => {
        fetchMock.mockResponseOnce('Invalid JSON');
        
        const request = new NextRequest('http://localhost:3000/api/playlists/123');
        const response = await GET(request, {params: {id: '123'}});
        const responseData = await response.json();
        
        expect(response.status).toBe(500);
        expect(responseData).toEqual({error: "プレイリストの取得に失敗しました"});
    });
    
    it('BACKEND_URL環境変数が設定されていない場合、デフォルトURLを使用すること', async () => {
        delete process.env.BACKEND_URL;
        const mockPlaylistData = {id: '123', name: 'Test Playlist'};
        fetchMock.mockResponseOnce(JSON.stringify(mockPlaylistData));
        
        const request = new NextRequest('http://localhost:3000/api/playlists/123');
        await GET(request, {params: {id: '123'}});
        
        expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/playlists/123');
    });
});
