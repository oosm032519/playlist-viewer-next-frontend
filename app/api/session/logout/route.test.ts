// app/api/session/logout/logout.test.ts

import {POST} from './route';
import {NextRequest, NextResponse} from 'next/server';
import {UnauthorizedError} from '@/app/lib/errors';
import {expect} from '@jest/globals'

// モックの設定
jest.mock('next/server', () => ({
    ...jest.requireActual('next/server'),
    NextResponse: {
        json: jest.fn().mockImplementation((body, init) => ({
            ...init,
            cookies: {
                set: jest.fn(),
            },
        })),
    },
}));

jest.mock('@/app/lib/api-utils', () => ({
    handleApiError: jest.fn().mockImplementation((error) => ({
        status: error instanceof UnauthorizedError ? 401 : 500,
        json: () => ({message: error.message}),
    })),
}));

describe('POST /api/session/logout', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.NEXT_PUBLIC_BACKEND_URL = 'http://test-backend.com';
    });
    
    it('正常にログアウトできる場合', async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            status: 200,
        });
        
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue('sessionId=test-session-id'),
            },
        } as unknown as NextRequest;
        
        const response = await POST(mockRequest) as NextResponse;
        
        expect(response.status).toBe(200);
        expect((response as any).cookies.set).toHaveBeenCalledWith({
            name: 'sessionId',
            value: '',
            path: '/',
            maxAge: 0,
        });
        expect(global.fetch).toHaveBeenCalledWith(
            'http://test-backend.com/api/session/logout',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Cookie': 'sessionId=test-session-id',
                }),
            })
        );
    });
    
    it('sessionIdが見つからない場合', async () => {
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue(''),
            },
        } as unknown as NextRequest;
        
        const response = await POST(mockRequest);
        
        expect(response.status).toBe(401);
    });
    
    it('バックエンドAPIがエラーを返す場合', async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: false,
            status: 500,
        });
        
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue('sessionId=test-session-id'),
            },
        } as unknown as NextRequest;
        
        const response = await POST(mockRequest);
        
        expect(response.status).toBe(500);
    });
});
