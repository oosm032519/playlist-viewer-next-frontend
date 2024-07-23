// app/api/playlists/followed/route.test.ts
import {NextRequest} from 'next/server';
import {GET} from './route';
import {expect} from '@jest/globals';

jest.mock('next/server', () => ({
    NextRequest: jest.fn().mockImplementation((url, init) => ({
        url,
        headers: new Map(Object.entries(init.headers)),
    })),
    NextResponse: {
        json: jest.fn((data, init) => ({
            json: async () => data,
            status: init?.status || 200,
        })),
    },
}));

describe('GET handler', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('should return playlists when API call is successful', async () => {
        const mockRequest = new NextRequest('http://localhost:3000/api/playlists/followed', {
            headers: {
                cookie: 'test-cookie'
            }
        });
        
        const mockPlaylists = [{id: 1, name: 'Playlist 1'}, {id: 2, name: 'Playlist 2'}];
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => mockPlaylists,
        });
        
        const response = await GET(mockRequest);
        const jsonResponse = await response.json();
        
        expect(jsonResponse).toEqual(mockPlaylists);
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/playlists/followed', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Cookie': 'test-cookie',
            },
        });
    });
    
    it('should return error when API call fails', async () => {
        const mockRequest = new NextRequest('http://localhost:3000/api/playlists/followed', {
            headers: {
                cookie: 'test-cookie'
            }
        });
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 500,
        });
        
        const response = await GET(mockRequest);
        const jsonResponse = await response.json();
        
        expect(jsonResponse).toEqual({
            error: 'フォロー中のプレイリストの取得中にエラーが発生しました: Failed to fetch playlists: HTTP error! status: 500'
        });
        expect(response.status).toBe(500);
    });
    
    it('should return error when fetch throws an Error', async () => {
        const mockRequest = new NextRequest('http://localhost:3000/api/playlists/followed', {
            headers: {
                cookie: 'test-cookie'
            }
        });
        
        global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
        
        const response = await GET(mockRequest);
        const jsonResponse = await response.json();
        
        expect(jsonResponse).toEqual({
            error: 'フォロー中のプレイリストの取得中にエラーが発生しました: Failed to fetch playlists: Network error'
        });
        expect(response.status).toBe(500);
    });
    
    it('should return error with unknown error message when fetch throws a non-Error exception', async () => {
        const mockRequest = new NextRequest('http://localhost:3000/api/playlists/followed', {
            headers: {
                cookie: 'test-cookie'
            }
        });
        
        global.fetch = jest.fn().mockRejectedValue('Some non-error exception');
        
        const response = await GET(mockRequest);
        const jsonResponse = await response.json();
        
        expect(jsonResponse).toEqual({
            error: 'フォロー中のプレイリストの取得中にエラーが発生しました: Failed to fetch playlists: Unknown error'
        });
        expect(response.status).toBe(500);
    });
});
