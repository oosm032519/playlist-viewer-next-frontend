// app/api/playlists/[id]/route.test.ts

import {NextRequest} from 'next/server';
import {GET} from './route';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('GET function', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        process.env.BACKEND_URL = 'http://test-backend.com';
        jest.spyOn(console, 'log').mockImplementation(() => {
        });
        jest.spyOn(console, 'error').mockImplementation(() => {
        });
    });
    
    afterEach(() => {
        jest.restoreAllMocks();
    });
    
    it('正常なレスポンスを処理できること', async () => {
        const mockPlaylistData = {id: '123', name: 'Test Playlist', songs: [{id: '1', title: 'Song 1'}]};
        fetchMock.mockResponseOnce(JSON.stringify(mockPlaylistData));
        
        const request = new NextRequest('http://localhost:3000/api/playlists/123');
        const response = await GET(request, {params: {id: '123'}});
        const responseData = await response.json();
        
        expect(response.status).toBe(200);
        expect(responseData).toEqual(mockPlaylistData);
        expect(fetchMock).toHaveBeenCalledWith('http://test-backend.com/api/playlists/123');
        expect(response.headers.get('Content-Type')).toBe('application/json');
    });
    
    it('バックエンドAPIのエラーを適切に処理できること', async () => {
        fetchMock.mockRejectOnce(new Error('Network error'));
        
        const request = new NextRequest('http://localhost:3000/api/playlists/123');
        const response = await GET(request, {params: {id: '123'}});
        const responseData = await response.json();
        
        expect(response.status).toBe(500);
        expect(responseData).toEqual({error: "プレイリストの取得に失敗しました"});
        expect(console.error).toHaveBeenCalledWith("プレイリストの取得に失敗しました:", expect.any(Error));
    });
    
    it('無効なJSONレスポンスを適切に処理できること', async () => {
        fetchMock.mockResponseOnce('Invalid JSON');
        
        const request = new NextRequest('http://localhost:3000/api/playlists/123');
        const response = await GET(request, {params: {id: '123'}});
        const responseData = await response.json();
        
        expect(response.status).toBe(500);
        expect(responseData).toEqual({error: "プレイリストの取得に失敗しました"});
        expect(console.error).toHaveBeenCalledWith("プレイリストの取得に失敗しました:", expect.any(Error));
    });
    
    it('BACKEND_URL環境変数が設定されていない場合、デフォルトURLを使用すること', async () => {
        delete process.env.BACKEND_URL;
        const mockPlaylistData = {id: '123', name: 'Test Playlist'};
        fetchMock.mockResponseOnce(JSON.stringify(mockPlaylistData));
        
        const request = new NextRequest('http://localhost:3000/api/playlists/123');
        await GET(request, {params: {id: '123'}});
        
        expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/playlists/123');
    });
    
    it('HTTPエラーを適切に処理できること', async () => {
        fetchMock.mockResponseOnce('Not Found', {status: 404});
        
        const request = new NextRequest('http://localhost:3000/api/playlists/123');
        const response = await GET(request, {params: {id: '123'}});
        const responseData = await response.json();
        
        expect(response.status).toBe(500);
        expect(responseData).toEqual({error: "プレイリストの取得に失敗しました"});
        expect(console.error).toHaveBeenCalledWith("プレイリストの取得に失敗しました:", expect.any(Error));
    });
    
    it('大きなデータセットを処理できること', async () => {
        const largeMockPlaylistData = {
            id: '123',
            name: 'Large Test Playlist',
            songs: Array(1000).fill(null).map((_, index) => ({id: `${index}`, title: `Song ${index}`}))
        };
        fetchMock.mockResponseOnce(JSON.stringify(largeMockPlaylistData));
        
        const request = new NextRequest('http://localhost:3000/api/playlists/123');
        const response = await GET(request, {params: {id: '123'}});
        const responseData = await response.json();
        
        expect(response.status).toBe(200);
        expect(responseData).toEqual(largeMockPlaylistData);
        expect(responseData.songs.length).toBe(1000);
    });
    
    it('異なるプレイリストIDに対して正しく動作すること', async () => {
        const mockPlaylistData = {id: '456', name: 'Another Test Playlist'};
        fetchMock.mockResponseOnce(JSON.stringify(mockPlaylistData));
        
        const request = new NextRequest('http://localhost:3000/api/playlists/456');
        const response = await GET(request, {params: {id: '456'}});
        const responseData = await response.json();
        
        expect(response.status).toBe(200);
        expect(responseData).toEqual(mockPlaylistData);
        expect(fetchMock).toHaveBeenCalledWith('http://test-backend.com/api/playlists/456');
    });
    
    it('レスポンスタイムが許容範囲内であること', async () => {
        const mockPlaylistData = {id: '123', name: 'Test Playlist'};
        fetchMock.mockResponseOnce(JSON.stringify(mockPlaylistData));
        
        const request = new NextRequest('http://localhost:3000/api/playlists/123');
        const startTime = Date.now();
        await GET(request, {params: {id: '123'}});
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        expect(responseTime).toBeLessThan(1000); // 1秒以内にレスポンスが返ってくることを期待
    });
    
    it('レスポンスデータの構造が正しいこと', async () => {
        const mockPlaylistData = {
            id: '123',
            name: 'Test Playlist',
            songs: [
                {id: '1', title: 'Song 1', artist: 'Artist 1'},
                {id: '2', title: 'Song 2', artist: 'Artist 2'}
            ]
        };
        fetchMock.mockResponseOnce(JSON.stringify(mockPlaylistData));
        
        const request = new NextRequest('http://localhost:3000/api/playlists/123');
        const response = await GET(request, {params: {id: '123'}});
        const responseData = await response.json();
        
        expect(responseData).toHaveProperty('id');
        expect(responseData).toHaveProperty('name');
        expect(responseData).toHaveProperty('songs');
        expect(Array.isArray(responseData.songs)).toBe(true);
        expect(responseData.songs[0]).toHaveProperty('id');
        expect(responseData.songs[0]).toHaveProperty('title');
        expect(responseData.songs[0]).toHaveProperty('artist');
    });
    
    it('空のプレイリストを正しく処理できること', async () => {
        const emptyPlaylistData = {id: '123', name: 'Empty Playlist', songs: []};
        fetchMock.mockResponseOnce(JSON.stringify(emptyPlaylistData));
        
        const request = new NextRequest('http://localhost:3000/api/playlists/123');
        const response = await GET(request, {params: {id: '123'}});
        const responseData = await response.json();
        
        expect(response.status).toBe(200);
        expect(responseData).toEqual(emptyPlaylistData);
        expect(responseData.songs).toHaveLength(0);
    });
});
