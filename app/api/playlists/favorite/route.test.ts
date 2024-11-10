// app/api/playlists/favorite/route.test.ts

import {NextRequest} from 'next/server';
import {POST, DELETE} from '@/app/api/playlists/favorite/route';
import * as apiUtils from '@/app/lib/api-utils';
import {UnauthorizedError} from '@/app/lib/errors';
import {expect} from '@jest/globals'

// モックの設定
jest.mock('next/server', () => ({
    NextRequest: jest.fn(),
    NextResponse: {
        json: jest.fn((data) => data),
    },
}));
jest.mock('@/app/lib/api-utils', () => ({
    handleApiError: jest.fn(),
    getCookies: jest.fn(), // getCookiesをモック
    sendRequest: jest.fn(), // sendRequestをモック
}));

// グローバルなfetch関数をモック
global.fetch = jest.fn();

describe('Favorite Playlist API Route', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    describe('POST handler', () => {
        it('正常なPOSTリクエストを処理できること', async () => {
            (apiUtils.getCookies as jest.Mock).mockReturnValue('sessionId=test-session-id'); // getCookiesのモックを設定
            const mockRequest = {
                headers: {
                    get: jest.fn().mockReturnValue('sessionId=test-session-id'),
                },
                json: jest.fn().mockResolvedValue({
                    playlistId: '1234',
                    playlistName: 'Test Playlist',
                    totalTracks: 10,
                    playlistOwnerName: 'Test User',
                }),
            };
            (apiUtils.sendRequest as jest.Mock).mockResolvedValue({ // sendRequestのモックを使用
                ok: true,
                json: jest.fn().mockResolvedValue({success: true}),
            });
            const response = await POST(mockRequest as unknown as NextRequest);
            const responseData = await response.json(); // レスポンスボディを取得
            
            expect(response.status).toBe(200); // ステータスコードをチェック
            expect(responseData).toEqual({success: true}); // レスポンスボディをチェック
        });
        
        it('Cookieが存在しない場合にUnauthorizedErrorを投げること', async () => {
            (apiUtils.getCookies as jest.Mock).mockReturnValue(''); // getCookiesのモックを設定
            const mockRequest = {
                headers: {
                    get: jest.fn().mockReturnValue(null),
                },
            };
            (apiUtils.handleApiError as jest.Mock).mockReturnValue({error: 'Unauthorized'});
            const response = await POST(mockRequest as unknown as NextRequest);
            expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(UnauthorizedError));
            expect(response).toEqual({error: 'Unauthorized'});
        });
        
        it('sessionIdが空の場合にUnauthorizedErrorを投げること', async () => {
            (apiUtils.getCookies as jest.Mock).mockReturnValue('sessionId='); // getCookiesのモックを設定
            const mockRequest = {
                headers: {
                    get: jest.fn().mockReturnValue('sessionId='),
                },
            };
            (apiUtils.handleApiError as jest.Mock).mockReturnValue({error: 'Unauthorized'});
            const response = await POST(mockRequest as unknown as NextRequest);
            expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(UnauthorizedError));
            expect(response).toEqual({error: 'Unauthorized'});
        });
        
        it('APIリクエストが失敗した場合にエラーを処理すること', async () => {
            (apiUtils.getCookies as jest.Mock).mockReturnValue('sessionId=test-session-id'); // getCookiesのモックを設定
            const mockRequest = {
                headers: {
                    get: jest.fn().mockReturnValue('sessionId=test-session-id'),
                },
                json: jest.fn().mockResolvedValue({
                    playlistId: '1234',
                    playlistName: 'Test Playlist',
                    totalTracks: 10,
                    playlistOwnerName: 'Test User',
                }),
            };
            (apiUtils.sendRequest as jest.Mock).mockResolvedValue({ // sendRequestのモックを使用
                ok: false,
                status: 500,
            });
            (apiUtils.handleApiError as jest.Mock).mockReturnValue({error: 'Internal Server Error'});
            const response = await POST(mockRequest as unknown as NextRequest);
            expect(apiUtils.handleApiError).toHaveBeenCalled();
            expect(response).toEqual({error: 'Internal Server Error'});
        });
    });
    
    describe('DELETE handler', () => {
        it('正常なDELETEリクエストを処理できること', async () => {
            (apiUtils.getCookies as jest.Mock).mockReturnValue('sessionId=test-session-id'); // getCookiesのモックを設定
            const mockRequest = {
                headers: {
                    get: jest.fn().mockReturnValue('sessionId=test-session-id'),
                },
                json: jest.fn().mockResolvedValue({
                    playlistId: '5678',
                    playlistName: 'Test Playlist',
                    totalTracks: 5,
                    playlistOwnerName: 'Test User',
                }),
            };
            (apiUtils.sendRequest as jest.Mock).mockResolvedValue({ // sendRequestのモックを使用
                ok: true,
                json: jest.fn().mockResolvedValue({success: true}),
            });
            const response = await DELETE(mockRequest as unknown as NextRequest);
            const responseData = await response.json(); // レスポンスボディを取得
            
            expect(response.status).toBe(200); // ステータスコードをチェック
            expect(responseData).toEqual({success: true}); // レスポンスボディをチェック
        });
        
        it('Cookieが存在しない場合にUnauthorizedErrorを投げること', async () => {
            (apiUtils.getCookies as jest.Mock).mockReturnValue(''); // getCookiesのモックを設定
            const mockRequest = {
                headers: {
                    get: jest.fn().mockReturnValue(null),
                },
            };
            (apiUtils.handleApiError as jest.Mock).mockReturnValue({error: 'Unauthorized'});
            const response = await DELETE(mockRequest as unknown as NextRequest);
            expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(UnauthorizedError));
            expect(response).toEqual({error: 'Unauthorized'});
        });
        
        it('sessionIdが空の場合にUnauthorizedErrorを投げること', async () => {
            (apiUtils.getCookies as jest.Mock).mockReturnValue('sessionId='); // getCookiesのモックを設定
            const mockRequest = {
                headers: {
                    get: jest.fn().mockReturnValue('sessionId='),
                },
            };
            (apiUtils.handleApiError as jest.Mock).mockReturnValue({error: 'Unauthorized'});
            const response = await DELETE(mockRequest as unknown as NextRequest);
            expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(UnauthorizedError));
            expect(response).toEqual({error: 'Unauthorized'});
        });
        
        it('APIリクエストが失敗した場合にエラーを処理すること', async () => {
            (apiUtils.getCookies as jest.Mock).mockReturnValue('sessionId=test-session-id'); // getCookiesのモックを設定
            const mockRequest = {
                headers: {
                    get: jest.fn().mockReturnValue('sessionId=test-session-id'),
                },
                json: jest.fn().mockResolvedValue({
                    playlistId: '5678',
                    playlistName: 'Test Playlist',
                    totalTracks: 5,
                    playlistOwnerName: 'Test User',
                }),
            };
            (apiUtils.sendRequest as jest.Mock).mockResolvedValue({ // sendRequestのモックを使用
                ok: false,
                status: 500,
            });
            (apiUtils.handleApiError as jest.Mock).mockReturnValue({error: 'Internal Server Error'});
            const response = await DELETE(mockRequest as unknown as NextRequest);
            expect(apiUtils.handleApiError).toHaveBeenCalled();
            expect(response).toEqual({error: 'Internal Server Error'});
        });
    });
});
