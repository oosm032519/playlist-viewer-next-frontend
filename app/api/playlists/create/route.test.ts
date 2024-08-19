// app/api/playlists/create/route.test.ts

import {POST} from './route';
import {NextRequest} from 'next/server';
import {UnauthorizedError} from '@/app/lib/errors';
import * as apiUtils from '@/app/lib/api-utils';
import {expect} from '@jest/globals';

// モックの設定
jest.mock('next/server', () => ({
    NextRequest: jest.fn(),
}));

jest.mock('@/app/lib/api-utils', () => ({
    handleApiError: jest.fn(),
}));

// フェッチのモック
global.fetch = jest.fn();

describe('POST /api/playlists/create', () => {
    let mockRequest: jest.Mocked<NextRequest>;
    
    beforeEach(() => {
        jest.clearAllMocks();
        mockRequest = {
            json: jest.fn(),
            cookies: {
                get: jest.fn(),
            },
        } as unknown as jest.Mocked<NextRequest>;
        mockRequest.json.mockResolvedValue(['track1', 'track2']);
        (mockRequest.cookies.get as jest.Mock).mockReturnValue({value: 'test-session-id'});
        process.env.NEXT_PUBLIC_BACKEND_URL = 'http://test-backend.com';
    });
    
    it('正常にプレイリストを作成できる場合', async () => {
        const mockResponseData = {id: 'playlist1', name: 'New Playlist'};
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValueOnce(mockResponseData),
        });
        
        const response = await POST(mockRequest);
        const responseData = await response.json();
        
        expect(response.status).toBe(200);
        expect(responseData).toEqual(mockResponseData);
        expect(global.fetch).toHaveBeenCalledWith(
            'http://test-backend.com/api/playlists/create',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                    'Cookie': 'sessionId=test-session-id',
                }),
                body: JSON.stringify(['track1', 'track2']),
                credentials: 'include',
            })
        );
    });
    
    it('認証されていない場合', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 401,
        });
        
        await POST(mockRequest);
        
        expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
    
    it('その他のエラーが発生した場合', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: jest.fn().mockResolvedValueOnce({details: 'Server error'}),
        });
        
        await POST(mockRequest);
        
        expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(Error));
    });
    
    it('セッションIDが存在しない場合', async () => {
        (mockRequest.cookies.get as jest.Mock).mockReturnValue(undefined);
        const mockResponseData = {id: 'playlist1', name: 'New Playlist'};
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValueOnce(mockResponseData),
        });
        
        await POST(mockRequest);
        
        expect(global.fetch).toHaveBeenCalledWith(
            'http://test-backend.com/api/playlists/create',
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Cookie': '',
                }),
            })
        );
    });
});
