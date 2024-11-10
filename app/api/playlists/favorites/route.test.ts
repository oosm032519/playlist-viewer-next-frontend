// app/api/playlists/favorites/route.test.ts

import {NextRequest} from 'next/server';
import {GET} from '@/app/api/playlists/favorites/route';
import {expect} from '@jest/globals';

// モックの設定
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((data) => ({json: () => data})),
    },
}));

jest.mock('@/app/lib/api-utils', () => ({
    handleApiError: jest.fn((error) => {
        if (error instanceof Response && error.status === 404) {
            return {status: 404, json: () => ({error: 'お気に入りプレイリストの取得に失敗しました: 404'})};
        }
        return {status: 500, json: () => ({error: error.message})};
    }),
    getCookies: jest.fn((request) => request.headers.get('cookie') || ''),
    sendRequest: jest.fn(async (url, method, body, cookies) => {
        if (url === '/api/session/check' && method === 'GET') {
            return {ok: true, status: 200, json: async () => ({})};
        }
        if (url === '/api/playlists/favorites' && method === 'GET') {
            if (cookies.includes('mock-error')) {
                throw new Response(JSON.stringify({error: 'お気に入りプレイリストの取得に失敗しました: 404'}), {status: 404});
            }
            return {
                ok: true,
                status: 200,
                json: async () => ({playlists: [{id: 1, name: 'Favorites'}]})
            };
        }
        throw new Error('Unexpected request');
    }),
}));

describe('GET handler for favorite playlists', () => {
    const mockEnv = process.env;
    
    beforeEach(() => {
        jest.resetModules();
        process.env = {...mockEnv, NEXT_PUBLIC_BACKEND_URL: 'http://mock-backend.com'};
    });
    
    afterEach(() => {
        process.env = mockEnv;
        jest.restoreAllMocks();
    });
    
    it('should successfully fetch favorite playlists', async () => {
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue('sessionId=mock-session-id'),
            },
        } as unknown as NextRequest;
        
        const response = await GET(mockRequest);
        const result = await response.json();
        
        expect(result).toEqual({playlists: [{id: 1, name: 'Favorites'}]});
    });
    
    it('should throw UnauthorizedError when cookie is missing', async () => {
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue(null),
            },
        } as unknown as NextRequest;
        
        const response = await GET(mockRequest);
        const result = await response.json();
        
        expect(result).toEqual({error: 'sessionIdが見つかりません'});
    });
    
    it('should throw UnauthorizedError when sessionId is missing', async () => {
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue('someCookie=value'),
            },
        } as unknown as NextRequest;
        
        const response = await GET(mockRequest);
        const result = await response.json();
        
        expect(result).toEqual({error: 'sessionIdが見つかりません'});
    });
    
    it('should handle API error when fetch fails', async () => {
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue('sessionId=mock-session-id; mock-error=true'),
            },
        } as unknown as NextRequest;
        
        const response = await GET(mockRequest);
        const result = await response.json();
        
        expect(result).toEqual({error: 'お気に入りプレイリストの取得に失敗しました: 404'});
    });
    
    it('should handle non-OK response from API', async () => {
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue('sessionId=mock-session-id; mock-error=true'),
            },
        } as unknown as NextRequest;
        
        const response = await GET(mockRequest);
        const result = await response.json();
        
        expect(result).toEqual({error: 'お気に入りプレイリストの取得に失敗しました: 404'});
    });
});
