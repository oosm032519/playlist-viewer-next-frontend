// app/api/session/logout/logout.test.ts

import {POST} from './route';
import {NextRequest, NextResponse} from 'next/server';
import {UnauthorizedError} from '@/app/lib/errors';
import {expect} from '@jest/globals';

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

// handleApiErrorのモックを修正
jest.mock('@/app/lib/api-utils', () => ({
    handleApiError: jest.fn().mockImplementation((error) => {
        if (error instanceof UnauthorizedError) {
            return NextResponse.json({error: error.message}, {status: 401});
        }
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }),
    getCookies: jest.fn().mockReturnValue('sessionId=test-session-id'),
    sendRequest: jest.fn(),
}));

describe('POST /api/session/logout', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.NEXT_PUBLIC_BACKEND_URL = 'http://test-backend.com';
    });
    
    it('正常にログアウトできる場合', async () => {
        const mockSendRequest = jest.requireMock('@/app/lib/api-utils').sendRequest;
        mockSendRequest.mockResolvedValueOnce({
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
        expect(mockSendRequest).toHaveBeenCalledWith(
            '/api/session/logout',
            'POST',
            undefined,
            'sessionId=test-session-id'
        );
    });
    
    it('sessionIdが見つからない場合', async () => {
        const mockGetCookies = jest.requireMock('@/app/lib/api-utils').getCookies;
        mockGetCookies.mockReturnValueOnce('');
        
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue(''),
            },
        } as unknown as NextRequest;
        
        const response = await POST(mockRequest) as NextResponse;
        
        expect(response.status).toBe(401);
    });
    
    it('バックエンドAPIがエラーを返す場合', async () => {
        const mockSendRequest = jest.requireMock('@/app/lib/api-utils').sendRequest;
        mockSendRequest.mockRejectedValueOnce(new Error('Backend error'));
        
        const mockRequest = {
            headers: {
                get: jest.fn().mockReturnValue('sessionId=test-session-id'),
            },
        } as unknown as NextRequest;
        
        const response = await POST(mockRequest) as NextResponse;
        
        expect(response.status).toBe(500);
    });
});
