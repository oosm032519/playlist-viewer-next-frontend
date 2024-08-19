// app/api/playlists/add-track/route.test.ts

import {POST} from './route';
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
    });
    
    it('正常にトラックをプレイリストに追加できる場合', async () => {
        const mockResponseData = {success: true, message: 'Track added successfully'};
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
            'http://test-backend.com/api/playlist/add-track',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                    'Cookie': 'test-cookie',
                }),
                body: JSON.stringify({playlistId: '1', trackId: '2'}),
            })
        );
    });
    
    it('プレイリストが見つからない場合', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 404,
        });
        
        await POST(mockRequest);
        
        expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(NotFoundError));
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
});
