// app/lib/api-utils.test.ts

import {NextResponse} from 'next/server';
import {handleApiError} from './api-utils';
import {ApiError} from './errors';
import {expect} from '@jest/globals'

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
        delete global.Response;
    });
    
    afterAll(() => {
        global.Response = originalResponse;
    });
    
    beforeEach(() => {
        jest.clearAllMocks();
        console.error = jest.fn(); // console.errorをモック化
    });
    
    it('ApiErrorを適切に処理する (NextResponse)', async () => {
        const apiError = new ApiError(400, 'Bad Request', 'Invalid input');
        const result = await handleApiError(apiError);
        
        expect(console.error).toHaveBeenCalledWith('API Error:', apiError, undefined);
        expect(NextResponse.json).toHaveBeenCalledWith(
            {
                error: '入力内容に誤りがあります。もう一度確認してください。',
                details: 'リクエスト内容を確認してください。\n詳細: Invalid input'
            },
            {status: 400}
        );
        expect(result).toEqual({
            body: {
                error: '入力内容に誤りがあります。もう一度確認してください。',
                details: 'リクエスト内容を確認してください。\n詳細: Invalid input'
            },
            init: {status: 400}
        });
    });
    
    it('ApiErrorを適切に処理する (Response)', async () => {
        // @ts-ignore
        global.Response = originalResponse;
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
        // @ts-ignore
        delete global.Response;
    });
    
    it('一般的なErrorを適切に処理する', async () => {
        const error = new Error('Something went wrong');
        const result = await handleApiError(error);
        
        expect(console.error).toHaveBeenCalledWith('API Error:', error, undefined);
        expect(NextResponse.json).toHaveBeenCalledWith(
            {
                error: 'サーバーでエラーが発生しました。しばらくしてからもう一度お試しください。',
                details: expect.stringContaining('管理者に連絡してください。\n詳細: Error: Something went wrong')
            },
            {status: 500}
        );
        expect(result).toEqual({
            body: {
                error: 'サーバーでエラーが発生しました。しばらくしてからもう一度お試しください。',
                details: expect.stringContaining('管理者に連絡してください。\n詳細: Error: Something went wrong')
            },
            init: {status: 500}
        });
    });
    
    it('コンテキスト情報を適切に処理する', async () => {
        const error = new Error('Database connection failed');
        const context = 'データベース接続';
        const result = await handleApiError(error, context);
        
        expect(console.error).toHaveBeenCalledWith('API Error:', error, context);
        expect(NextResponse.json).toHaveBeenCalledWith(
            {
                error: 'サーバーでエラーが発生しました。しばらくしてからもう一度お試しください。',
                details: expect.stringContaining('データベース接続 でエラーが発生しました: 管理者に連絡してください。\n詳細: Error: Database connection failed')
            },
            {status: 500}
        );
        expect(result).toEqual({
            body: {
                error: 'サーバーでエラーが発生しました。しばらくしてからもう一度お試しください。',
                details: expect.stringContaining('データベース接続 でエラーが発生しました: 管理者に連絡してください。\n詳細: Error: Database connection failed')
            },
            init: {status: 500}
        });
    });
    
    it('401エラーを適切に処理する', async () => {
        const apiError = new ApiError(401, 'Unauthorized', 'Login required');
        const result = await handleApiError(apiError);
        
        expect(console.error).toHaveBeenCalledWith('API Error:', apiError, undefined);
        expect(NextResponse.json).toHaveBeenCalledWith(
            {
                error: 'ログインが必要です。ログインボタンからログインしてください。',
                details: 'Login required'
            },
            {status: 401}
        );
    });
    
    it('403エラーを適切に処理する', async () => {
        const apiError = new ApiError(403, 'Forbidden', 'Insufficient permissions');
        const result = await handleApiError(apiError);
        
        expect(console.error).toHaveBeenCalledWith('API Error:', apiError, undefined);
        expect(NextResponse.json).toHaveBeenCalledWith(
            {
                error: 'アクセスが拒否されました',
                details: 'この操作を行う権限がありません。\n詳細: Insufficient permissions'
            },
            {status: 403}
        );
    });
    
    it('404エラーを適切に処理する', async () => {
        const apiError = new ApiError(404, 'Not Found', 'Resource not found');
        const result = await handleApiError(apiError);
        
        expect(console.error).toHaveBeenCalledWith('API Error:', apiError, undefined);
        expect(NextResponse.json).toHaveBeenCalledWith(
            {
                error: 'リソースが見つかありません',
                details: 'お探しのリソースが見つかりません。\n詳細: Resource not found'
            },
            {status: 404}
        );
    });
});
