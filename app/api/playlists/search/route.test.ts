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

global.fetch = jest.fn();

describe('GET /api/playlists/search', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('should return 400 if query parameter is missing', async () => {
        const request = new Request('http://localhost:3000/api/playlists/search');
        const response = await GET(request);
        
        expect(response.status).toBe(400);
        const json = await response.json();
        expect(json).toEqual({error: 'Query parameter is required'});
    });
    
    it('should return playlists data when query parameter is provided', async () => {
        const mockData = {playlists: ['playlist1', 'playlist2']};
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });
        
        const request = new Request('http://localhost:3000/api/playlists/search?query=test&offset=0&limit=20');
        const response = await GET(request);
        
        expect(response.status).toBe(200);
        const json = await response.json();
        expect(json).toEqual(mockData);
    });
    
    it('should return 500 if fetch fails', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
        });
        
        const request = new Request('http://localhost:3000/api/playlists/search?query=test&offset=0&limit=20');
        const response = await GET(request);
        
        expect(response.status).toBe(500);
        const json = await response.json();
        expect(json).toEqual({error: 'Internal Server Error'});
    });
    
    it('should handle fetch error', async () => {
        (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
        
        const request = new Request('http://localhost:3000/api/playlists/search?query=test&offset=0&limit=20');
        const response = await GET(request);
        
        expect(response.status).toBe(500);
        const json = await response.json();
        expect(json).toEqual({error: 'Internal Server Error'});
    });
});
