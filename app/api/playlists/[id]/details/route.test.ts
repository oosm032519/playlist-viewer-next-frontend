// app/api/playlists/[id]/details/route.test.ts

import {NextRequest, NextResponse} from 'next/server';
import {GET} from '@/app/api/playlists/[id]/details/route';
import * as apiUtils from '@/app/lib/api-utils';
import {expect} from '@jest/globals';

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

// フェッチのモック
global.fetch = jest.fn();

describe('GET /api/playlists/[id]/details', () => {
    let mockRequest: jest.Mocked<NextRequest>;
    
    beforeEach(() => {
        jest.clearAllMocks();
        mockRequest = {
            headers: {
                get: jest.fn(),
            },
        } as unknown as jest.Mocked<NextRequest>;
        process.env.NEXT_PUBLIC_BACKEND_URL = 'http://test-backend.com';
    });
    
    it('正常にプレイリストの詳細情報を取得できる場合', async () => {
        const mockResponseData = {id: '1', name: 'Playlist 1'};
        (apiUtils.sendRequest as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => mockResponseData,
        });
        (apiUtils.getCookies as jest.Mock).mockReturnValue('sessionId=test-session-id');
        
        const response = await GET(mockRequest, {params: {id: '1'}});
        
        expect(response).toHaveProperty('json');
        expect(response).toHaveProperty('status', 200);
        const responseData = await response.json();
        
        expect(responseData).toEqual(mockResponseData);
        expect(apiUtils.sendRequest).toHaveBeenCalledWith(
            '/api/playlists/1/details',
            'GET',
            undefined,
            'sessionId=test-session-id'
        );
    });
    
    it('認証されていない場合', async () => {
        (apiUtils.getCookies as jest.Mock).mockReturnValue('');
        (apiUtils.handleApiError as jest.Mock).mockReturnValue(NextResponse.json({error: 'Unauthorized'}, {status: 401}));
        
        const response = await GET(mockRequest, {params: {id: '1'}});
        
        expect(response).toHaveProperty('json');
        expect(response).toHaveProperty('status', 401);
        const responseData = await response.json();
        expect(responseData).toEqual({error: 'Unauthorized'});
    });
    
    it('その他のエラーが発生した場合', async () => {
        (apiUtils.sendRequest as jest.Mock).mockRejectedValueOnce(new Error('Server error'));
        (apiUtils.getCookies as jest.Mock).mockReturnValue('sessionId=test-session-id');
        (apiUtils.handleApiError as jest.Mock).mockReturnValue(NextResponse.json({error: 'Internal Server Error'}, {status: 500}));
        
        const response = await GET(mockRequest, {params: {id: '1'}});
        
        expect(response).toHaveProperty('json');
        expect(response).toHaveProperty('status', 500);
        const responseData = await response.json();
        expect(responseData).toEqual({error: 'Internal Server Error'});
    });
});
