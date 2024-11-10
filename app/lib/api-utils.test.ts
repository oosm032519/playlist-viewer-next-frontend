// app/lib/api-utils.test.ts

import {handleApiError} from '@/app/lib/api-utils';
import {ApiError} from '@/app/lib/errors';
import {expect, jest, describe, it, beforeAll, afterAll, beforeEach} from '@jest/globals';

// NextResponseをモック化
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((body, init) => ({body, init})),
    },
}));

describe('handleApiError', () => {
    let originalResponse: typeof Response;
    
    beforeAll(() => {
        originalResponse = global.Response;
        // @ts-ignore
        global.Response = class MockResponse {
            status: number;
            body: any;
            
            constructor(body?: BodyInit | null, init?: ResponseInit) {
                this.body = body;
                this.status = init?.status || 200;
            }
            
            json() {
                return Promise.resolve(JSON.parse(this.body));
            }
        };
    });
    
    afterAll(() => {
        global.Response = originalResponse;
    });
    
    beforeEach(() => {
        jest.clearAllMocks();
        console.error = jest.fn(); // console.errorをモック化
    });
    
    it('ApiErrorを適切に処理する', async () => {
        const apiError = new ApiError(400, 'Bad Request', 'Invalid input');
        const result = await handleApiError(apiError);
        
        expect(console.error).toHaveBeenCalledWith('API Error:', apiError, undefined);
        expect(result).toBeInstanceOf(Response);
        const responseData = await result.json();
        expect(responseData).toEqual({
            error: '入力内容に誤りがあります。もう一度確認してください。',
            details: 'リクエスト内容を確認してください。\n詳細: Invalid input'
        });
        expect(result.status).toBe(400);
    });
    
    it('一般的なErrorを適切に処理する', async () => {
        const error = new Error('Something went wrong');
        const result = await handleApiError(error);
        
        expect(console.error).toHaveBeenCalledWith('API Error:', error, undefined);
        expect(result).toBeInstanceOf(Response);
        const responseData = await result.json();
        expect(responseData).toEqual({
            error: 'サーバーでエラーが発生しました。しばらくしてからもう一度お試しください。',
            details: expect.stringContaining('管理者に連絡してください。\n詳細: Error: Something went wrong')
        });
        expect(result.status).toBe(500);
    });
    
    it('コンテキスト情報を適切に処理する', async () => {
        const error = new Error('Database connection failed');
        const context = 'データベース接続';
        const result = await handleApiError(error, context);
        
        expect(console.error).toHaveBeenCalledWith('API Error:', error, context);
        expect(result).toBeInstanceOf(Response);
        const responseData = await result.json();
        expect(responseData).toEqual({
            error: 'サーバーでエラーが発生しました。しばらくしてからもう一度お試しください。',
            details: expect.stringContaining('データベース接続 でエラーが発生しました: 管理者に連絡してください。\n詳細: Error: Database connection failed')
        });
        expect(result.status).toBe(500);
    });
    
    it('401エラーを適切に処理する', async () => {
        const apiError = new ApiError(401, 'Unauthorized', 'Login required');
        const result = await handleApiError(apiError);
        
        expect(console.error).toHaveBeenCalledWith('API Error:', apiError, undefined);
        expect(result).toBeInstanceOf(Response);
        const responseData = await result.json();
        expect(responseData).toEqual({
            error: 'ログインが必要です。ログインボタンからログインしてください。',
            details: 'Login required'
        });
        expect(result.status).toBe(401);
    });
    
    it('403エラーを適切に処理する', async () => {
        const apiError = new ApiError(403, 'Forbidden', 'Insufficient permissions');
        const result = await handleApiError(apiError);
        
        expect(console.error).toHaveBeenCalledWith('API Error:', apiError, undefined);
        expect(result).toBeInstanceOf(Response);
        const responseData = await result.json();
        expect(responseData).toEqual({
            error: 'アクセスが拒否されました',
            details: 'この操作を行う権限がありません。\n詳細: Insufficient permissions'
        });
        expect(result.status).toBe(403);
    });
    
    it('404エラーを適切に処理する', async () => {
        const apiError = new ApiError(404, 'Not Found', 'Resource not found');
        const result = await handleApiError(apiError);
        
        expect(console.error).toHaveBeenCalledWith('API Error:', apiError, undefined);
        expect(result).toBeInstanceOf(Response);
        const responseData = await result.json();
        expect(responseData).toEqual({
            error: 'リソースが見つかりません',
            details: 'お探しのリソースが見つかりません。\n詳細: Resource not found'
        });
        expect(result.status).toBe(404);
    });
});
