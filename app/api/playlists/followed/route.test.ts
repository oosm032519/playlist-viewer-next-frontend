// app/api/playlists/followed/route.test.ts

import {NextRequest, NextResponse} from 'next/server';
import {GET} from './route';
import {expect} from '@jest/globals';

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

global.fetch = jest.fn();

console.log = jest.fn();
console.error = jest.fn();

describe('GET handler for followed playlists', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('should return playlists when API call is successful', async () => {
        const mockSessionId = 'mock-session-id';
        const mockPlaylists = [{id: 1, name: 'Playlist 1'}, {id: 2, name: 'Playlist 2'}];
        
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockPlaylists),
        });
        
        const req = new NextRequest('http://localhost:3000/api/playlists/followed', {
            method: 'GET',
            headers: {
                'Cookie': `sessionId=${mockSessionId}`,
            },
        });
        
        await GET(req);
        
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/playlists/followed',
            expect.objectContaining({
                method: 'GET',
                headers: {
                    'Cookie': `sessionId=${mockSessionId}`,
                },
                credentials: 'include',
            })
        );
        
        expect(NextResponse.json).toHaveBeenCalledWith(mockPlaylists);
    });
    
    it('should handle API errors and return a 500 response', async () => {
        const mockSessionId = 'mock-session-id';
        const mockError = new Error('API error');
        
        (global.fetch as jest.Mock).mockRejectedValue(mockError);
        
        const req = new NextRequest('http://localhost:3000/api/playlists/followed', {
            method: 'GET',
            headers: {
                'Cookie': `sessionId=${mockSessionId}`,
            },
        });
        
        await GET(req);
        
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/playlists/followed',
            expect.objectContaining({
                method: 'GET',
                headers: {
                    'Cookie': `sessionId=${mockSessionId}`,
                },
                credentials: 'include',
            })
        );
        
        expect(NextResponse.json).toHaveBeenCalledWith(
            {error: 'フォロー中のプレイリストの取得中にエラーが発生しました: Failed to fetch playlists: API error'},
            {status: 500}
        );
    });
    
    it('should handle missing Cookie', async () => {
        const req = new NextRequest('http://localhost:3000/api/playlists/followed', {
            method: 'GET',
        });
        
        await GET(req);
        
        expect(global.fetch).not.toHaveBeenCalled();
        
        expect(NextResponse.json).toHaveBeenCalledWith(
            {error: 'フォロー中のプレイリストの取得中にエラーが発生しました: Failed to fetch playlists: Cookie missing'},
            {status: 500}
        );
    });
    
    it('should use custom backend URL when environment variable is set', async () => {
        process.env.NEXT_PUBLIC_BACKEND_URL = 'https://custom-backend.com';
        
        const mockSessionId = 'mock-session-id';
        const mockPlaylists = [{id: 1, name: 'Playlist 1'}];
        
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockPlaylists),
        });
        
        const req = new NextRequest('http://localhost:3000/api/playlists/followed', {
            method: 'GET',
            headers: {
                'Cookie': `sessionId=${mockSessionId}`,
            },
        });
        
        await GET(req);
        
        expect(global.fetch).toHaveBeenCalledWith(
            'https://custom-backend.com/api/playlists/followed',
            expect.objectContaining({
                method: 'GET',
                headers: {
                    'Cookie': `sessionId=${mockSessionId}`,
                },
                credentials: 'include',
            })
        );
        
        delete process.env.NEXT_PUBLIC_BACKEND_URL;
    });
    
    it('should handle non-Error objects thrown', async () => {
        const mockSessionId = 'mock-session-id';
        
        (global.fetch as jest.Mock).mockRejectedValue('Non-Error object');
        
        const req = new NextRequest('http://localhost:3000/api/playlists/followed', {
            method: 'GET',
            headers: {
                'Cookie': `sessionId=${mockSessionId}`,
            },
        });
        
        await GET(req);
        
        expect(NextResponse.json).toHaveBeenCalledWith(
            {error: 'フォロー中のプレイリストの取得中にエラーが発生しました: Failed to fetch playlists: Unknown error'},
            {status: 500}
        );
    });
    
    it('should handle API response that is not ok', async () => {
        const mockSessionId = 'mock-session-id';
        
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 404,
        });
        
        const req = new NextRequest('http://localhost:3000/api/playlists/followed', {
            method: 'GET',
            headers: {
                'Cookie': `sessionId=${mockSessionId}`,
            },
        });
        
        await GET(req);
        
        expect(NextResponse.json).toHaveBeenCalledWith(
            {error: 'フォロー中のプレイリストの取得中にエラーが発生しました: Failed to fetch playlists: HTTP error! status: 404'},
            {status: 500}
        );
    });
    
    it('should handle unknown errors in GET handler', async () => {
        const mockSessionId = 'mock-session-id';
        
        (global.fetch as jest.Mock).mockRejectedValue('Unknown error');
        
        const req = new NextRequest('http://localhost:3000/api/playlists/followed', {
            method: 'GET',
            headers: {
                'Cookie': `sessionId=${mockSessionId}`,
            },
        });
        
        await GET(req);
        
        expect(NextResponse.json).toHaveBeenCalledWith(
            {error: 'フォロー中のプレイリストの取得中にエラーが発生しました: Failed to fetch playlists: Unknown error'},
            {status: 500}
        );
    });
    
    it('should handle unknown errors in GET handler', async () => {
        const mockSessionId = 'mock-session-id';
        
        (global.fetch as jest.Mock).mockRejectedValue('Unknown error');
        
        const req = new NextRequest('http://localhost:3000/api/playlists/followed', {
            method: 'GET',
            headers: {
                'Cookie': `sessionId=${mockSessionId}`,
            },
        });
        
        await GET(req);
        
        expect(NextResponse.json).toHaveBeenCalledWith(
            {error: 'フォロー中のプレイリストの取得中にエラーが発生しました: Failed to fetch playlists: Unknown error'},
            {status: 500}
        );
    });
    
    it('should handle missing sessionId', async () => {
        const req = new NextRequest('http://localhost:3000/api/playlists/followed', {
            method: 'GET',
            headers: {
                'Cookie': 'someCookie=someValue',
            },
        });
        
        await GET(req);
        
        expect(global.fetch).not.toHaveBeenCalled();
        
        expect(NextResponse.json).toHaveBeenCalledWith(
            {error: 'フォロー中のプレイリストの取得中にエラーが発生しました: Failed to fetch playlists: sessionId missing'},
            {status: 500}
        );
    });
});
