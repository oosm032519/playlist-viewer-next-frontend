// app/api/playlists/search/route.test.ts

import {GET} from './route';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {NextRequest} from 'next/server';
import {expect} from '@jest/globals';

jest.mock('next/server', () => ({
    NextRequest: jest.fn().mockImplementation((input: string, init?: RequestInit) => ({
        headers: new Headers(init?.headers),
        url: input,
    })),
    NextResponse: {
        json: jest.fn((data: any, init?: { status?: number }) => ({
            status: init?.status || 200,
            json: async () => data,
        })),
    },
}));

describe('GET /api/playlists/search', () => {
    let mock: MockAdapter;
    
    beforeAll(() => {
        mock = new MockAdapter(axios);
    });
    
    afterEach(() => {
        mock.reset();
    });
    
    afterAll(() => {
        mock.restore();
    });
    
    it('should return 400 if query parameter is missing', async () => {
        const req = new NextRequest('http://localhost:3000/api/playlists/search');
        const res = await GET(req);
        
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json).toEqual({error: 'Query parameter is required'});
    });
    
    it('should return playlists if query parameter is provided', async () => {
        const mockPlaylists = [{id: 1, name: 'Test Playlist'}];
        
        mock.onGet('http://localhost:8080/api/playlists/search?query=test').reply(200, mockPlaylists);
        
        const req = new NextRequest('http://localhost:3000/api/playlists/search?query=test');
        const res = await GET(req);
        
        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json).toEqual(mockPlaylists);
    });
    
    it('should return 500 if there is an error fetching playlists', async () => {
        mock.onGet('http://localhost:8080/api/playlists/search?query=test').reply(500);
        
        const req = new NextRequest('http://localhost:3000/api/playlists/search?query=test');
        const res = await GET(req);
        
        expect(res.status).toBe(500);
        const json = await res.json();
        expect(json).toEqual({error: 'Internal Server Error'});
    });
    
    it('should log appropriate messages during the request lifecycle', async () => {
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        
        const mockPlaylists = [{id: 1, name: 'Test Playlist'}];
        
        mock.onGet('http://localhost:8080/api/playlists/search?query=test').reply(200, mockPlaylists);
        
        const req = new NextRequest('http://localhost:3000/api/playlists/search?query=test');
        await GET(req);
        
        expect(consoleLogSpy).toHaveBeenCalledWith('GET リクエストを受信しました');
        expect(consoleLogSpy).toHaveBeenCalledWith('クエリパラメータ: test');
        expect(consoleLogSpy).toHaveBeenCalledWith('プレイリスト検索APIからレスポンスを受信しました');
        expect(consoleLogSpy).toHaveBeenCalledWith(`レスポンスデータ: ${JSON.stringify(mockPlaylists)}`);
        
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });
    
    it('should log error message if there is an error fetching playlists', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        
        mock.onGet('http://localhost:8080/api/playlists/search?query=test').reply(500);
        
        const req = new NextRequest('http://localhost:3000/api/playlists/search?query=test');
        await GET(req);
        
        expect(consoleErrorSpy).toHaveBeenCalledWith('プレイリスト取得中にエラーが発生しました:', expect.any(Error));
        
        consoleErrorSpy.mockRestore();
    });
});
