// app/api/playlists/create/route.test.ts

import {POST} from '@/app/api/playlists/create/route';
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
    getCookies: jest.fn(), // getCookiesをモック
    sendRequest: jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({id: 'playlist1', name: 'New Playlist'}),
    }),
}));

// フェッチのモック
global.fetch = jest.fn();

describe('POST /api/playlists/create', () => {
    let mockRequest: jest.Mocked<NextRequest>;
    
    beforeEach(() => {
        jest.clearAllMocks();
        mockRequest = {
            json: jest.fn(),
            headers: {
                get: jest.fn(),
            },
        } as unknown as jest.Mocked<NextRequest>;
        mockRequest.json.mockResolvedValue(['track1', 'track2']);
        (mockRequest.headers.get as jest.Mock).mockReturnValue('sessionId=test-session-id'); // Cookieヘッダーをモック
        (apiUtils.getCookies as jest.Mock).mockReturnValue('sessionId=test-session-id'); // getCookiesをモック
        process.env.NEXT_PUBLIC_BACKEND_URL = 'http://test-backend.com';
    });
    
    it('正常にプレイリストを作成できる場合', async () => {
        const mockResponseData = {id: 'playlist1', name: 'New Playlist'};
        (apiUtils.sendRequest as jest.Mock).mockResolvedValueOnce({ // sendRequestをモック
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValueOnce(mockResponseData),
        });
        
        const response = await POST(mockRequest);
        const responseData = await response.json();
        
        expect(response.status).toBe(200);
        expect(responseData).toEqual(mockResponseData);
        expect(apiUtils.sendRequest).toHaveBeenCalledWith( // sendRequestの呼び出しを確認
            '/api/playlists/create',
            'POST',
            ['track1', 'track2'],
            'sessionId=test-session-id'
        );
    });
    
    it('認証されていない場合', async () => {
        (apiUtils.sendRequest as jest.Mock).mockRejectedValueOnce(new UnauthorizedError('Unauthorized')); // sendRequestをモックしてエラーを返す
        
        await POST(mockRequest);
        
        expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
    
    it('その他のエラーが発生した場合', async () => {
        (apiUtils.sendRequest as jest.Mock).mockRejectedValueOnce(new Error('Server error')); // sendRequestをモックしてエラーを返す
        
        await POST(mockRequest);
        
        expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(Error));
    });
    
    it('セッションIDが存在しない場合', async () => {
        (mockRequest.headers.get as jest.Mock).mockReturnValue(undefined); // CookieヘッダーをモックしてセッションIDが存在しない状態にする
        (apiUtils.getCookies as jest.Mock).mockReturnValue(''); // getCookiesをモックして空文字を返す
        const mockResponseData = {id: 'playlist1', name: 'New Playlist'};
        (apiUtils.sendRequest as jest.Mock).mockResolvedValueOnce({ // sendRequestをモック
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValueOnce(mockResponseData),
        });
        
        await POST(mockRequest);
        
        expect(apiUtils.sendRequest).toHaveBeenCalledWith( // sendRequestの呼び出しを確認
            '/api/playlists/create',
            'POST',
            ['track1', 'track2'],
            ''
        );
    });
});
