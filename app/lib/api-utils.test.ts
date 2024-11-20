// app/lib/api-utils.test.ts

import {NextRequest, NextResponse} from 'next/server';
import {handleApiError, sendRequest, getCookies} from './api-utils';
import {ApiError} from '@/app/lib/errors';

// モック関数を使用して外部依存関係を処理
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn(),
    },
}));

describe('handleApiError', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('should return a 500 response for unknown errors', async () => {
        const error = new Error('Unknown error');
        const response = await handleApiError(error);
        
        expect(NextResponse.json).toHaveBeenCalledWith(
            {
                error: 'サーバーでエラーが発生しました。しばらくしてからもう一度お試しください。',
                details: expect.stringContaining('Unknown error'),
            },
            {status: 500}
        );
    });
    
    it('should add context to the error details if provided', async () => {
        const error = new Error('Contextual error');
        const context = 'User creation';
        await handleApiError(error, context);
        
        expect(NextResponse.json).toHaveBeenCalledWith(
            {
                error: 'サーバーでエラーが発生しました。しばらくしてからもう一度お試しください。',
                details: expect.stringContaining('User creation'),
            },
            {status: 500}
        );
    });
    
    it('should handle string errors correctly', async () => {
        const error = 'Simple string error';
        await handleApiError(error);
        
        expect(NextResponse.json).toHaveBeenCalledWith(
            {
                error: 'サーバーでエラーが発生しました。しばらくしてからもう一度お試しください。',
                details: expect.stringContaining('予期しないエラーが発生しました'),
            },
            {status: 500}
        );
    });
});

describe('sendRequest', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });
    
    afterEach(() => {
        jest.resetAllMocks();
    });
    
    it('should send a request with the correct parameters', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue({success: true}),
        });
        
        const response = await sendRequest('/test-endpoint', 'POST', {key: 'value'}, 'cookie=value');
        
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/test-endpoint'),
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                    Cookie: 'cookie=value',
                }),
                body: JSON.stringify({key: 'value'}),
                credentials: 'include',
            })
        );
        
        // レスポンスが正しく返されることを確認
        expect(response.ok).toBe(true);
    });
});

describe('getCookies', () => {
    it('should return cookies from the request headers', () => {
        const mockRequest = {
            headers: new Map([['cookie', 'sessionId=abc123']]),
        } as unknown as NextRequest;
        
        const cookies = getCookies(mockRequest);
        
        expect(cookies).toBe('sessionId=abc123');
    });
    
    it('should return an empty string if no cookies are present', () => {
        const mockRequest = {
            headers: new Map(),
        } as unknown as NextRequest;
        
        const cookies = getCookies(mockRequest);
        
        expect(cookies).toBe('');
    });
});
