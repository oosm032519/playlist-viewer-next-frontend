// app/api/session/sessionId/route.test.ts

import {POST} from './route';
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
}));

// フェッチのモック
global.fetch = jest.fn();

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
        const mockSessionId = 'test-session-id';
        const mockResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({sessionId: mockSessionId}),
        };
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
        
        const mockNextResponse = {
            cookies: {
                set: jest.fn(),
            },
        };
        (NextResponse.json as jest.Mock).mockReturnValue(mockNextResponse);
        
        const request = {
            json: jest.fn().mockResolvedValue({temporaryToken: 'test-token'}),
        };
        
        const response = await POST(request as any);
        
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/session/sessionId'),
            expect.objectContaining({
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({temporaryToken: 'test-token'}),
            })
        );
        
        expect(NextResponse.json).toHaveBeenCalledWith({sessionId: mockSessionId});
        expect(mockNextResponse.cookies.set).toHaveBeenCalledWith(
            'sessionId',
            mockSessionId,
            expect.objectContaining({
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/',
                maxAge: 60 * 60 * 24 * 7,
            })
        );
        
        expect(response).toBe(mockNextResponse);
    });
    
    it('バックエンドAPIがエラーを返した場合、エラーハンドリングを行う', async () => {
        const mockErrorResponse = {
            ok: false,
            json: jest.fn().mockResolvedValue({details: 'エラーが発生しました'}),
        };
        (global.fetch as jest.Mock).mockResolvedValue(mockErrorResponse);
        
        const request = {
            json: jest.fn().mockResolvedValue({temporaryToken: 'test-token'}),
        };
        
        await POST(request as any);
        
        expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(Error));
    });
});
