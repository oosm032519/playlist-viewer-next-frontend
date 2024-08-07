// app/api/session/check/route.ts.test.ts

import {NextRequest} from 'next/server';
import {GET} from './route';
import {expect} from '@jest/globals';

jest.mock('next/server', () => {
    const originalModule = jest.requireActual('next/server');
    return {
        ...originalModule,
        NextResponse: {
            ...originalModule.NextResponse,
            json: jest.fn().mockImplementation((body, init) => {
                return {
                    status: init?.status || 200,
                    json: async () => body,
                };
            }),
        },
    };
});

global.fetch = jest.fn();

describe('GET /api/session/check', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.NEXT_PUBLIC_BACKEND_URL = 'http://test-backend.com';
        jest.spyOn(console, 'log').mockImplementation(() => {
        });
        jest.spyOn(console, 'error').mockImplementation(() => {
        });
    });
    
    afterEach(() => {
        (console.log as jest.Mock).mockRestore();
        (console.error as jest.Mock).mockRestore();
    });
    
    it('正常なレスポンスを返すべき', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            status: 200,
            ok: true,
            json: jest.fn().mockResolvedValue({status: 'active'}),
        });
        
        const request = new NextRequest('http://localhost:3000/api/session/check', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer test-jwt-token'
            }
        });
        
        const response = await GET(request);
        
        expect(response.status).toBe(200);
        const responseData = await response.json();
        expect(responseData).toEqual({status: 'active'});
        
        expect(global.fetch).toHaveBeenCalledWith(
            'http://test-backend.com/api/session/check',
            expect.objectContaining({
                headers: {
                    'Authorization': 'Bearer test-jwt-token',
                },
            })
        );
        
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('GET /api/session/check - リクエスト開始'));
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('環境変数からバックエンドURLを取得: http://test-backend.com'));
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('リクエストヘッダーから Authorization ヘッダーを取得: Bearer test-jwt-token'));
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('セッションチェックのためのAPIリクエストを送信: http://test-backend.com/api/session/check'));
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('APIレスポンスステータス: 200'));
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('APIレスポンスデータを取得: {"status":"active"}'));
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('セッションの状態を含むレスポンスを返す'));
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('GET /api/session/check - リクエスト終了'));
    });
    
    it('Authorization ヘッダーが存在しない場合、401エラーを返すべき', async () => {
        const request = new NextRequest('http://localhost:3000/api/session/check', {
            method: 'GET',
        });
        
        const response = await GET(request);
        
        expect(response.status).toBe(401);
        const responseData = await response.json();
        expect(responseData).toEqual({status: 'error', message: 'Authorization ヘッダーがありません'});
        
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('リクエストヘッダーから Authorization ヘッダーを取得: null'));
    });
    
    it('バックエンドAPIがエラーを返した場合、エラーレスポンスを返すべき', async () => {
        (global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'));
        
        const request = new NextRequest('http://localhost:3000/api/session/check', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer test-jwt-token'
            }
        });
        
        const response = await GET(request);
        
        expect(response.status).toBe(500);
        const responseData = await response.json();
        expect(responseData).toEqual({status: 'error', message: 'セッションチェックに失敗しました'});
        
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('セッションチェックエラー:'), expect.any(Error));
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('エラーレスポンスを返す'));
    });
    
    it('環境変数NEXT_PUBLIC_BACKEND_URLが設定されていない場合、デフォルトURLを使用すべき', async () => {
        delete process.env.NEXT_PUBLIC_BACKEND_URL;
        
        (global.fetch as jest.Mock).mockResolvedValue({
            status: 200,
            ok: true,
            json: jest.fn().mockResolvedValue({status: 'active'}),
        });
        
        const request = new NextRequest('http://localhost:3000/api/session/check', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer test-jwt-token'
            }
        });
        
        await GET(request);
        
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/session/check',
            expect.anything()
        );
        
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('環境変数からバックエンドURLを取得: http://localhost:8080'));
    });
});
