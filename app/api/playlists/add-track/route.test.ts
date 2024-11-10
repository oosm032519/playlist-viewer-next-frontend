// app/api/playlists/add-track/route.test.ts

import {POST} from '@/app/api/playlists/add-track/route';
import {NextRequest} from 'next/server';
import {NotFoundError, UnauthorizedError} from '@/app/lib/errors';
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

describe('POST /api/playlists/add-track', () => {
    let mockRequest: jest.Mocked<NextRequest>;
    
    beforeEach(() => {
        jest.clearAllMocks();
        mockRequest = {
            json: jest.fn(),
            headers: {
                get: jest.fn(),
            },
        } as unknown as jest.Mocked<NextRequest>;
        mockRequest.json.mockResolvedValue({playlistId: '1', trackId: '2'});
        (mockRequest.headers.get as jest.Mock).mockReturnValue('test-cookie');
        process.env.NEXT_PUBLIC_BACKEND_URL = 'http://test-backend.com';
        
        // getCookiesのモック
        (apiUtils.getCookies as jest.Mock).mockReturnValue('test-cookie');
        
        // sendRequestのモック
        (apiUtils.sendRequest as jest.Mock).mockImplementation(() => {
            return Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve({success: true, message: 'Track added successfully'}),
            });
        });
    });
    
    it('正常にトラックをプレイリストに追加できる場合', async () => {
        const response = await POST(mockRequest);
        const responseData = await response.json();
        
        expect(response.status).toBe(200);
        expect(responseData).toEqual({success: true, message: 'Track added successfully'});
        expect(apiUtils.sendRequest).toHaveBeenCalledWith(
            '/api/playlist/add-track',
            'POST',
            {playlistId: '1', trackId: '2'},
            'test-cookie'
        );
    });
    
    it('プレイリストが見つからない場合', async () => {
        (apiUtils.sendRequest as jest.Mock).mockRejectedValueOnce(new NotFoundError('Playlist not found'));
        
        await POST(mockRequest);
        
        expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(NotFoundError));
    });
    
    it('認証されていない場合', async () => {
        (apiUtils.sendRequest as jest.Mock).mockRejectedValueOnce(new UnauthorizedError('Unauthorized'));
        
        await POST(mockRequest);
        
        expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
    
    it('その他のエラーが発生した場合', async () => {
        (apiUtils.sendRequest as jest.Mock).mockRejectedValueOnce(new Error('Server error'));
        
        await POST(mockRequest);
        
        expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(Error));
    });
});
