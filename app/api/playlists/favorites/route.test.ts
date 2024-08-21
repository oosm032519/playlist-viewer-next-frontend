// app/api/playlists/favorites/route.test.ts

import {NextRequest} from 'next/server';
import {GET} from './route';
import {expect} from '@jest/globals'

// モックの設定
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((data) => ({json: () => data})),
    },
}));

jest.mock('@/app/lib/api-utils', () => ({
    handleApiError: jest.fn((error) => ({status: 500, json: () => ({error: error.message})})),
}));

describe('GET handler for favorite playlists', () => {
    const mockEnv = process.env;
    
    beforeEach(() => {
        jest.resetModules();
        process.env = {...mockEnv, NEXT_PUBLIC_BACKEND_URL: 'http://mock-backend.com'};
        global.fetch = jest.fn();
    });
    
    afterEach(() => {
        process.env = mockEnv;
        jest.restoreAllMocks();
    });
    
    it('should successfully fetch favorite playlists', async () => {
        const mockData = {playlists: [{id: 1, name: 'Favorites'}]};
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockData),
        });
        
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue('sessionId=mock-session-id'),
            },
        } as unknown as NextRequest;
        
        const response = await GET(mockRequest);
        const result = await response.json();
        
        expect(result).toEqual(mockData);
        expect(global.fetch).toHaveBeenCalledWith(
            'http://mock-backend.com/api/playlists/favorites',
            expect.objectContaining({
                headers: {'Cookie': 'sessionId=mock-session-id'},
                credentials: 'include',
            })
        );
    });
    
    it('should throw UnauthorizedError when cookie is missing', async () => {
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue(null),
            },
        } as unknown as NextRequest;
        
        const response = await GET(mockRequest);
        const result = await response.json();
        
        expect(result).toEqual({error: 'Cookieが見つかりません'});
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
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
        
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue('sessionId=mock-session-id'),
            },
        } as unknown as NextRequest;
        
        const response = await GET(mockRequest);
        const result = await response.json();
        
        expect(result).toEqual({error: 'Network error'});
    });
    
    it('should handle non-OK response from API', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 404,
        });
        
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue('sessionId=mock-session-id'),
            },
        } as unknown as NextRequest;
        
        const response = await GET(mockRequest);
        const result = await response.json();
        
        expect(result).toEqual({error: 'お気に入りプレイリストの取得に失敗しました: 404'});
    });
});
