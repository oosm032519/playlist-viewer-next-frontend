// app/api/session/check/route.test.ts

import {GET} from './route';
import fetchMock from 'jest-fetch-mock';
import {NextRequest} from 'next/server';
import {expect} from '@jest/globals';

// NextResponseとNextRequestをモック化
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((body, init) => ({
            json: () => Promise.resolve(body),
            status: init?.status || 200,
        })),
    },
    NextRequest: jest.fn().mockImplementation(() => ({
        headers: {
            get: jest.fn().mockReturnValue('test-cookie'),
        },
    })),
}));

// fetchをモック化
fetchMock.enableMocks();

describe('Session API Route', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        jest.clearAllMocks();
    });
    
    /**
     * 正常なレスポンスを返すべき
     * - モックデータを使用してAPIレスポンスをシミュレート
     * - GET関数を呼び出し、レスポンスとデータを検証
     */
    it('正常なレスポンスを返すべき', async () => {
        const mockData = {status: 'active', userId: '123'};
        fetchMock.mockResponseOnce(JSON.stringify(mockData));
        
        const mockRequest = new NextRequest('http://localhost:3000/api/session/check');
        const response = await GET(mockRequest);
        const data = await response.json();
        
        expect(response.status).toBe(200);
        expect(data).toEqual(mockData);
        expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/session/check', {
            headers: {
                'Cookie': 'test-cookie',
            },
            credentials: 'include',
        });
    });
    
    /**
     * 外部APIがエラーを返した場合、エラーレスポンスを返すべき
     * - ネットワークエラーをシミュレート
     * - GET関数を呼び出し、エラーレスポンスとデータを検証
     */
    it('外部APIがエラーを返した場合、エラーレスポンスを返すべき', async () => {
        fetchMock.mockRejectOnce(new Error('Network error'));
        
        const mockRequest = new NextRequest('http://localhost:3000/api/session/check');
        const response = await GET(mockRequest);
        const data = await response.json();
        
        expect(response.status).toBe(500);
        expect(data).toEqual({
            status: 'error',
            message: 'セッションチェックに失敗しました',
        });
    });
    
    /**
     * 外部APIからの無効なJSONレスポンスを処理すべき
     * - 無効なJSONレスポンスをシミュレート
     * - GET関数を呼び出し、エラーレスポンスとデータを検証
     */
    it('外部APIからの無効なJSONレスポンスを処理すべき', async () => {
        fetchMock.mockResponseOnce('Invalid JSON');
        
        const mockRequest = new NextRequest('http://localhost:3000/api/session/check');
        const response = await GET(mockRequest);
        const data = await response.json();
        
        expect(response.status).toBe(500);
        expect(data).toEqual({
            status: 'error',
            message: 'セッションチェックに失敗しました',
        });
    });
    
    /**
     * 外部APIからの予期しないステータスコードを処理すべき
     * - 401ステータスコードをシミュレート
     * - GET関数を呼び出し、レスポンスとデータを検証
     */
    it('外部APIからの予期しないステータスコードを処理すべき', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({error: 'Unauthorized'}), {status: 401});
        
        const mockRequest = new NextRequest('http://localhost:3000/api/session/check');
        const response = await GET(mockRequest);
        const data = await response.json();
        
        expect(response.status).toBe(200);
        expect(data).toEqual({error: 'Unauthorized'});
    });
    
    /**
     * クレデンシャルが正しく設定されているか確認すべき
     * - 正常なレスポンスをシミュレート
     * - GET関数を呼び出し、fetchMockの呼び出しを検証
     */
    it('クレデンシャルが正しく設定されているか確認すべき', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}));
        
        const mockRequest = new NextRequest('http://localhost:3000/api/session/check');
        await GET(mockRequest);
        
        expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/session/check', {
            headers: {
                'Cookie': 'test-cookie',
            },
            credentials: 'include',
        });
    });
    
    /**
     * コンソールにエラーがログされるべき
     * - ネットワークエラーをシミュレート
     * - GET関数を呼び出し、コンソールエラーログを検証
     */
    it('コンソールにエラーがログされるべき', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        fetchMock.mockRejectOnce(new Error('Network error'));
        
        const mockRequest = new NextRequest('http://localhost:3000/api/session/check');
        await GET(mockRequest);
        
        expect(consoleSpy).toHaveBeenCalledWith('セッションチェックエラー:', expect.any(Error));
        consoleSpy.mockRestore();
    });
});
