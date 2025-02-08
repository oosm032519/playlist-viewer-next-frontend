// app/api/session/sessionId/route.test.ts

import {POST} from '@/app/api/session/sessionId/route';
import {NextResponse} from 'next/server';
import {BadRequestError} from '@/app/lib/errors';
import * as apiUtils from '@/app/lib/api-utils';
import {expect} from '@jest/globals'

// モックの設定
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn(),
    },
}));

jest.mock('@/app/lib/api-utils', () => ({
    handleApiError: jest.fn(),
    sendRequest: jest.fn(),
}));

describe('POST /api/session/sessionId', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('一時トークンが提供されていない場合、BadRequestErrorを返す', async () => {
        const request = {
            json: jest.fn().mockResolvedValue({}),
        };
        
        await POST(request as any);
        
        expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
    
    it('セッションIDを正常に取得し、クッキーを設定する', async () => {
        // モックレスポンスのセッションIDを定義
        const mockSessionId = 'test-session-id';
        
        // バックエンドAPIのレスポンスをモック
        const mockResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({sessionId: mockSessionId}),
        };
        (apiUtils.sendRequest as jest.Mock).mockResolvedValue(mockResponse);
        
        // NextResponse.jsonをモック
        const mockNewResponse = {
            cookies: {
                set: jest.fn(),
            },
            headers: new Headers(),
        };
        (NextResponse.json as jest.Mock).mockReturnValue(mockNewResponse);
        
        // リクエストボディをモック
        const request = {
            json: jest.fn().mockResolvedValue({temporaryToken: 'test-token'}),
        };
        
        // 実行
        const response = await POST(request as any);
        
        // バックエンドAPI呼び出しの確認
        expect(apiUtils.sendRequest).toHaveBeenCalledWith(
            '/api/session/sessionId',
            'POST',
            {temporaryToken: 'test-token'}
        );
        
        // NextResponse.jsonの呼び出し確認
        expect(NextResponse.json).toHaveBeenCalledWith(
            {sessionId: mockSessionId},
            {
                status: 200,
                headers: {'Content-Type': 'application/json'},
            }
        );
        
        // クッキー設定の検証
        expect(mockNewResponse.cookies.set).toHaveBeenCalledWith(
            'sessionId',
            mockSessionId,
            expect.objectContaining({
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/',
                maxAge: 60 * 60, // 1時間
            })
        );
        
        // レスポンスの検証
        expect(response).toBe(mockNewResponse);
    });
    
    it('バックエンドAPIがエラーを返した場合、エラーハンドリングを行う', async () => {
        const mockErrorResponse = {
            ok: false,
            json: jest.fn().mockResolvedValue({details: 'エラーが発生しました'}),
        };
        (apiUtils.sendRequest as jest.Mock).mockRejectedValue(mockErrorResponse);
        
        const request = {
            json: jest.fn().mockResolvedValue({temporaryToken: 'test-token'}),
        };
        
        await POST(request as any);
        
        expect(apiUtils.handleApiError).toHaveBeenCalledWith(mockErrorResponse);
    });
});
