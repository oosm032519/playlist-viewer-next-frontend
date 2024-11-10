// app/api/playlists/remove-track/route.test.ts

import {POST} from '@/app/api/playlists/remove-track/route';
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
    getCookies: jest.fn(),
    sendRequest: jest.fn(),
}));

// フェッチのモック
global.fetch = jest.fn();

describe('POST /api/playlists/remove-track', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('正常にトラックを削除できること', async () => {
        // モックの設定
        const mockRequest = {
            json: jest.fn().mockResolvedValue({playlistId: '1', trackId: '2'}),
            headers: {
                get: jest.fn().mockReturnValue('validCookie'),
            },
        };
        (NextRequest as jest.Mock).mockImplementation(() => mockRequest);
        
        (apiUtils.getCookies as jest.Mock).mockReturnValue('validCookie');
        (apiUtils.sendRequest as jest.Mock).mockResolvedValue({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValue({message: 'Track removed successfully'}),
        });
        
        // テストの実行
        const response = await POST(mockRequest as unknown as NextRequest);
        const responseBody = await response.json();
        
        // アサーション
        expect(response.status).toBe(200);
        expect(responseBody).toEqual({message: 'Track removed successfully'});
        expect(apiUtils.sendRequest).toHaveBeenCalledWith(
            '/api/playlist/remove-track',
            'POST',
            {playlistId: '1', trackId: '2'},
            'validCookie'
        );
    });
    
    it('Cookieが存在しない場合にUnauthorizedErrorをスローすること', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({playlistId: '1', trackId: '2'}),
            headers: {
                get: jest.fn().mockReturnValue(null),
            },
        };
        (NextRequest as jest.Mock).mockImplementation(() => mockRequest);
        
        (apiUtils.getCookies as jest.Mock).mockReturnValue('');
        (apiUtils.handleApiError as jest.Mock).mockReturnValue(new Response(JSON.stringify({error: 'Unauthorized'}), {status: 401}));
        
        const response = await POST(mockRequest as unknown as NextRequest);
        
        expect(response.status).toBe(401);
        expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
    
    it('プレイリストが見つからない場合にNotFoundErrorをスローすること', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({playlistId: '1', trackId: '2'}),
            headers: {
                get: jest.fn().mockReturnValue('validCookie'),
            },
        };
        (NextRequest as jest.Mock).mockImplementation(() => mockRequest);
        
        (apiUtils.getCookies as jest.Mock).mockReturnValue('validCookie');
        (apiUtils.sendRequest as jest.Mock).mockRejectedValue({
            status: 404,
            json: jest.fn().mockResolvedValue({error: 'Not Found'}),
        });
        
        (apiUtils.handleApiError as jest.Mock).mockReturnValue(new Response(JSON.stringify({error: 'Not Found'}), {status: 404}));
        
        const response = await POST(mockRequest as unknown as NextRequest);
        
        expect(response.status).toBe(404);
        expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(Error));
    });
});
