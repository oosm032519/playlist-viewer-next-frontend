import {NextRequest} from 'next/server';
import {GET} from './route';
import * as apiUtils from '@/app/lib/api-utils';
import {expect} from '@jest/globals'

// モックの設定
jest.mock('next/server', () => ({
    NextRequest: jest.fn(),
    NextResponse: {
        json: jest.fn().mockImplementation((body, options) => ({
            body,
            ...options,
            headers: new Map(),
        })),
    },
}));

jest.mock('@/app/lib/api-utils', () => ({
    handleApiError: jest.fn(),
}));

describe('GET /api/session/check', () => {
    let mockFetch: jest.Mock;
    let consoleLogSpy: jest.SpyInstance;
    
    beforeEach(() => {
        // fetchのモック
        mockFetch = jest.fn();
        global.fetch = mockFetch;
        
        // console.logのスパイ
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        
        // 環境変数の設定
        process.env.NEXT_PUBLIC_BACKEND_URL = 'http://test-backend.com';
    });
    
    afterEach(() => {
        jest.resetAllMocks();
        consoleLogSpy.mockRestore();
    });
    
    it('正常なレスポンスを処理できること', async () => {
        // モックの設定
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue('session=test'),
            },
        } as unknown as NextRequest;
        
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValueOnce({isLoggedIn: true}),
        });
        
        // テスト実行
        const response = await GET(mockRequest);
        
        // アサーション
        expect(mockFetch).toHaveBeenCalledWith(
            'http://test-backend.com/api/session/check',
            expect.objectContaining({
                headers: {
                    'Cookie': 'session=test',
                },
                credentials: 'include',
            })
        );
        expect(response.body).toEqual({isLoggedIn: true});
        expect(response.status).toBe(200);
        expect(response.headers.get('Cache-Control')).toBe('no-store, no-cache, must-revalidate, proxy-revalidate');
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('GET /api/session/check - リクエスト開始'));
    });
    
    it('エラーが発生した場合にhandleApiErrorが呼ばれること', async () => {
        // モックの設定
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue('session=test'),
            },
        } as unknown as NextRequest;
        
        mockFetch.mockRejectedValueOnce(new Error('Network error'));
        
        // テスト実行
        await GET(mockRequest);
        
        // アサーション
        expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(Error));
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('GET /api/session/check - リクエスト終了'));
    });
});
