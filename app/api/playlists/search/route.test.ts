// app/api/playlists/search/route.test.ts

import {GET} from './route';
import {NextRequest} from 'next/server';
import * as apiUtils from '@/app/lib/api-utils';
import {BadRequestError} from '@/app/lib/errors';
import {expect} from '@jest/globals'

jest.mock('next/server', () => ({
    NextRequest: jest.fn(),
    NextResponse: {
        json: jest.fn((data) => ({json: () => data})),
    },
}));

jest.mock('@/app/lib/api-utils', () => ({
    handleApiError: jest.fn(),
    sendRequest: jest.fn(),
}));

describe('GET /api/playlists/search', () => {
    let mockRequest: jest.Mocked<NextRequest>;
    let originalEnv: NodeJS.ProcessEnv;
    
    beforeEach(() => {
        jest.clearAllMocks();
        mockRequest = {
            url: 'http://localhost:3000/api/playlists/search?query=test&offset=0&limit=20',
            nextUrl: {
                searchParams: new URLSearchParams('query=test&offset=0&limit=20'),
            },
        } as unknown as jest.Mocked<NextRequest>;
        originalEnv = process.env;
        process.env = {...originalEnv};
        process.env.NEXT_PUBLIC_BACKEND_URL = 'http://localhost:8080';
    });
    
    afterEach(() => {
        process.env = originalEnv;
    });
    
    it('正常にプレイリストを検索できる場合', async () => {
        const mockResponseData = {playlists: [{id: '1', name: 'Test Playlist'}]};
        (apiUtils.sendRequest as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockResponseData),
        });
        
        const response = await GET(mockRequest);
        const responseData = await response.json();
        
        expect(responseData).toEqual(mockResponseData);
        expect(apiUtils.sendRequest).toHaveBeenCalledWith(
            '/api/playlists/search?query=test&offset=0&limit=20',
            'GET'
        );
    });
    
    it('クエリパラメータが指定されていない場合', async () => {
        mockRequest = {
            url: 'http://localhost:3000/api/playlists/search',
            nextUrl: {
                searchParams: new URLSearchParams(''),
            },
        } as unknown as jest.Mocked<NextRequest>;
        
        await GET(mockRequest);
        
        expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
    
    it('バックエンドAPIがエラーを返す場合', async () => {
        (apiUtils.sendRequest as jest.Mock).mockRejectedValueOnce(new Error('Backend error'));
        
        await GET(mockRequest);
        
        expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(Error));
    });
    
    it('環境変数NEXT_PUBLIC_BACKEND_URLが設定されている場合', async () => {
        process.env.NEXT_PUBLIC_BACKEND_URL = 'http://custom-backend.com';
        
        const mockResponseData = {playlists: [{id: '1', name: 'Test Playlist'}]};
        (apiUtils.sendRequest as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockResponseData),
        });
        
        await GET(mockRequest);
        
        expect(apiUtils.sendRequest).toHaveBeenCalledWith(
            '/api/playlists/search?query=test&offset=0&limit=20',
            'GET'
        );
    });
});
