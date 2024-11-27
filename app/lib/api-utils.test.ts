// app/lib/api-utils.test.ts

import {NextRequest, NextResponse} from 'next/server';
import {handleApiError, sendRequest, getCookies} from './api-utils';
import {expect} from '@jest/globals';
import {ApiError} from '@/app/lib/errors';

// NextResponse.json と fetch をモック
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn(),
    },
}));
global.fetch = jest.fn() as jest.Mock;

describe('handleApiError', () => {
    beforeEach(() => {
        (NextResponse.json as jest.Mock).mockClear().mockReturnValue({
            headers: {
                set: jest.fn(),
            },
        });
    });
    
    it('should return a 500 response for unknown errors', async () => {
        const error = new Error('Unknown error');
        const mockHeaders = new Map();
        mockHeaders.set('cookie', 'test-cookie');
        
        const mockRequest = {
            headers: mockHeaders,
        } as unknown as NextRequest;
        
        await handleApiError(error, 'Test Context');
        
        expect(NextResponse.json).toHaveBeenCalledWith(
            {
                error: 'サーバーでエラーが発生しました。しばらくしてからもう一度お試しください。',
                details: expect.stringContaining('Unknown error'),
            },
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    Pragma: 'no-cache',
                    Expires: '0',
                    'Surrogate-Control': 'no-store',
                },
            }
        );
        
        expect(NextResponse.json).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({status: 500}));
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
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    Pragma: 'no-cache',
                    Expires: '0',
                    'Surrogate-Control': 'no-store',
                },
            }
        );
        
        expect(NextResponse.json).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({status: 500}));
    });
    
    it('should handle string errors correctly', async () => {
        const error = 'Simple string error';
        
        await handleApiError(error);
        
        expect(NextResponse.json).toHaveBeenCalledWith(
            {
                error: 'サーバーでエラーが発生しました。しばらくしてからもう一度お試しください。',
                details: expect.stringContaining('予期しないエラーが発生しました'),
            },
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    Pragma: 'no-cache',
                    Expires: '0',
                    'Surrogate-Control': 'no-store',
                },
            }
        );
        
        expect(NextResponse.json).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({status: 500}));
    });
    
    it('should handle ApiError correctly', async () => {
        const error = new ApiError(400, 'Bad Request', 'Invalid input');
        await handleApiError(error);
        
        expect(NextResponse.json).toHaveBeenCalledWith(
            {
                error: '入力内容に誤りがあります。もう一度確認してください。',
                details: expect.stringContaining('Invalid input'),
            },
            {
                status: 400,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    Pragma: 'no-cache',
                    Expires: '0',
                    'Surrogate-Control': 'no-store',
                },
            }
        );
        expect(NextResponse.json).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({status: 400}));
    });
    
    it('should handle Response errors correctly', async () => {
        const error = new Response('{"error": "Test Error", "details": "Test Details"}', {status: 404});
        await handleApiError(error);
        
        expect(NextResponse.json).toHaveBeenCalledWith(
            {
                error: "リソースが見つかりません",
                details: "お探しのリソースが見つかりません。\n詳細: Test Details",
            },
            expect.objectContaining({status: 404})
        );
    });
});


describe('sendRequest', () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
    });
    
    it('should send a request with the correct parameters', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
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
