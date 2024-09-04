// app/api/playlists/followed/route.test.ts

import {GET} from './route';
import {NextRequest, NextResponse} from 'next/server';
import * as apiUtils from '@/app/lib/api-utils';
import {expect} from '@jest/globals';
import * as authMiddleware from '@/app/middleware/auth';

// モックの設定
jest.mock('next/server', () => ({
    NextRequest: jest.fn(),
    NextResponse: {
        json: jest.fn((data, options) => ({
            json: async () => data,
            status: options?.status || 200,
            headers: {'Content-Type': 'application/json'}
        })),
    },
}));

jest.mock('@/app/lib/api-utils', () => ({
    handleApiError: jest.fn(),
    getCookies: jest.fn(),
    sendRequest: jest.fn(),
}));

jest.mock('@/app/middleware/auth', () => ({
    authMiddleware: jest.fn(),
    withAuth: jest.fn((handler) => handler),
}));

// フェッチのモック
global.fetch = jest.fn();

describe('GET /api/playlists/followed', () => {
    let mockRequest: jest.Mocked<NextRequest>;
    
    beforeEach(() => {
        jest.clearAllMocks();
        mockRequest = {
            headers: {
                get: jest.fn(),
            },
        } as unknown as jest.Mocked<NextRequest>;
        process.env.NEXT_PUBLIC_BACKEND_URL = 'http://test-backend.com';
        
        // authMiddlewareのモックを設定
        (authMiddleware.authMiddleware as jest.Mock).mockResolvedValue(undefined);
    });
    
    it('正常にフォロー中のプレイリストを取得できる場合', async () => {
        const mockResponseData = [{id: '1', name: 'Playlist 1'}];
        (apiUtils.sendRequest as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => mockResponseData,
        });
        (apiUtils.getCookies as jest.Mock).mockReturnValue('sessionId=test-session-id');
        
        const response = await GET(mockRequest);
        
        expect(response).toHaveProperty('json');
        expect(response).toHaveProperty('status', 200);
        const responseData = await response.json();
        
        expect(responseData).toEqual(mockResponseData);
        expect(apiUtils.sendRequest).toHaveBeenCalledWith(
            '/api/playlists/followed',
            'GET',
            undefined,
            'sessionId=test-session-id'
        );
    });
    
    it('認証されていない場合', async () => {
        (apiUtils.getCookies as jest.Mock).mockReturnValue('');
        (apiUtils.handleApiError as jest.Mock).mockReturnValue(NextResponse.json({error: 'Unauthorized'}, {status: 401}));
        (authMiddleware.authMiddleware as jest.Mock).mockResolvedValue(NextResponse.json({error: 'Unauthorized'}, {status: 401}));
        
        const response = await GET(mockRequest);
        
        expect(response).toHaveProperty('json');
        expect(response).toHaveProperty('status', 401);
        const responseData = await response.json();
        expect(responseData).toEqual({error: 'Unauthorized'});
    });
    
    it('その他のエラーが発生した場合', async () => {
        (apiUtils.sendRequest as jest.Mock).mockRejectedValueOnce(new Error('Server error'));
        (apiUtils.getCookies as jest.Mock).mockReturnValue('sessionId=test-session-id');
        (apiUtils.handleApiError as jest.Mock).mockReturnValue(NextResponse.json({error: 'Internal Server Error'}, {status: 500}));
        
        const response = await GET(mockRequest);
        
        expect(response).toHaveProperty('json');
        expect(response).toHaveProperty('status', 500);
        const responseData = await response.json();
        expect(responseData).toEqual({error: 'Internal Server Error'});
    });
});
