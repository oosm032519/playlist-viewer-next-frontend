// app/api/playlists/search/route.test.ts

import {GET} from './route';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {NextRequest, NextResponse} from 'next/server';

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
});
