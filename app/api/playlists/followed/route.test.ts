// app/api/playlists/followed/route.test.ts

import {NextRequest, NextResponse} from 'next/server';
import {GET} from './route';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

jest.mock('next/server', () => ({
    NextRequest: jest.fn().mockImplementation((input, init) => ({
        headers: new Headers(init?.headers),
        url: input,
    })),
    NextResponse: {
        json: jest.fn((data, init) => ({
            status: init?.status || 200,
            json: async () => data,
        })),
    },
}));

describe('GET /api/playlists/followed', () => {
    let mock: MockAdapter;
    
    beforeAll(() => {
        mock = new MockAdapter(axios);
    });
    
    afterEach(() => {
        mock.reset();
        jest.clearAllMocks();
    });
    
    afterAll(() => {
        mock.restore();
    });
    
    const createRequest = (url: string, headers?: Record<string, string>): NextRequest => {
        return new NextRequest(url, {headers}) as unknown as NextRequest;
    };
    
    it('should return followed playlists on success', async () => {
        const mockPlaylists = [
            {id: '1', name: 'Playlist 1', tracks: [{id: 't1', name: 'Track 1'}]},
            {id: '2', name: 'Playlist 2', tracks: [{id: 't2', name: 'Track 2'}]},
        ];
        
        mock.onGet('http://localhost:8080/api/playlists/followed').reply(200, mockPlaylists);
        
        const req = createRequest('http://localhost:3000/api/playlists/followed', {
            'cookie': 'test-cookie',
        });
        
        const res = await GET(req);
        
        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json).toEqual(mockPlaylists);
    });
    
    it('should return an error message on 500 server error', async () => {
        mock.onGet('http://localhost:8080/api/playlists/followed').reply(500);
        
        const req = createRequest('http://localhost:3000/api/playlists/followed', {
            'cookie': 'test-cookie',
        });
        
        const res = await GET(req);
        
        expect(res.status).toBe(500);
        const json = await res.json();
        expect(json).toEqual({error: 'フォロー中のプレイリストの取得中にエラーが発生しました。'});
    });
    
    it('should return an error message on network error', async () => {
        mock.onGet('http://localhost:8080/api/playlists/followed').networkError();
        
        const req = createRequest('http://localhost:3000/api/playlists/followed', {
            'cookie': 'test-cookie',
        });
        
        const res = await GET(req);
        
        expect(res.status).toBe(500);
        const json = await res.json();
        expect(json).toEqual({error: 'フォロー中のプレイリストの取得中にエラーが発生しました。'});
    });
    
    it('should return an error message on 404 not found', async () => {
        mock.onGet('http://localhost:8080/api/playlists/followed').reply(404);
        
        const req = createRequest('http://localhost:3000/api/playlists/followed', {
            'cookie': 'test-cookie',
        });
        
        const res = await GET(req);
        
        expect(res.status).toBe(500);
        const json = await res.json();
        expect(json).toEqual({error: 'フォロー中のプレイリストの取得中にエラーが発生しました。'});
    });
});
