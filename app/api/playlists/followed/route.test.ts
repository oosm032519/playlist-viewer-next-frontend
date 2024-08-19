// app/api/playlists/followed/route.test.ts

import {GET} from './route';
import {NextRequest} from 'next/server';
import {UnauthorizedError} from '@/app/lib/errors';
import * as apiUtils from '@/app/lib/api-utils';
import {expect} from '@jest/globals';

// モックの設定
jest.mock('next/server', () => ({
    NextRequest: jest.fn(),
    NextResponse: {
        json: jest.fn((data) => ({json: () => data})),
    },
}));

jest.mock('@/app/lib/api-utils', () => ({
    handleApiError: jest.fn(),
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
    });
    
    it('正常にフォロー中のプレイリストを取得できる場合', async () => {
        const mockResponseData = [{id: '1', name: 'Playlist 1'}];
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValueOnce(mockResponseData),
        });
        (mockRequest.headers.get as jest.Mock).mockReturnValue('sessionId=test-session-id');
        
        const response = await GET(mockRequest);
        const responseData = await response.json();
        
        expect(responseData).toEqual(mockResponseData);
        expect(global.fetch).toHaveBeenCalledWith(
            'http://test-backend.com/api/playlists/followed',
            expect.objectContaining({
                method: 'GET',
                headers: expect.objectContaining({
                    'Cookie': 'sessionId=test-session-id',
                }),
                credentials: 'include',
            })
        );
    });
    
    it('認証されていない場合', async () => {
        (mockRequest.headers.get as jest.Mock).mockReturnValue(null);
        
        await GET(mockRequest);
        
        expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
    
    it('その他のエラーが発生した場合', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: jest.fn().mockResolvedValueOnce({details: 'Server error'}),
        });
        (mockRequest.headers.get as jest.Mock).mockReturnValue('sessionId=test-session-id');
        
        await GET(mockRequest);
        
        expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(Error));
    });
});
