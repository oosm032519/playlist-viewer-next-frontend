// app/api/playlists/add-track/route.test.ts

import {POST} from './route';
import {NextRequest} from 'next/server';
import {expect} from '@jest/globals';

// モックフェッチ関数の型定義
type MockFetch = jest.Mock<Promise<Response>, [input: RequestInfo | URL, init?: RequestInit | undefined]>;

describe('POST handler', () => {
    let mockFetch: MockFetch;
    let originalFetch: typeof global.fetch;
    let originalEnv: NodeJS.ProcessEnv;
    let mockConsoleError: jest.SpyInstance;
    
    // テスト全体の前に一度だけ実行されるセットアップ
    beforeAll(() => {
        originalFetch = global.fetch;
        originalEnv = process.env;
    });
    
    // 各テストの前に実行されるセットアップ
    beforeEach(() => {
        mockFetch = jest.fn();
        global.fetch = mockFetch as unknown as typeof global.fetch;
        process.env = {...originalEnv, BACKEND_URL: 'http://localhost:8080'};
        mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {
        });
    });
    
    // 各テストの後に実行されるクリーンアップ
    afterEach(() => {
        jest.resetAllMocks();
        mockConsoleError.mockRestore();
    });
    
    // テスト全体の後に一度だけ実行されるクリーンアップ
    afterAll(() => {
        global.fetch = originalFetch;
        process.env = originalEnv;
    });

// 正常にトラックをプレイリストに追加できることをテスト
    it('正常にトラックをプレイリストに追加できること', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({playlistId: '1', trackId: '2'}),
            headers: {
                get: jest.fn().mockReturnValue('session=test'),
            },
        } as unknown as NextRequest;
        
        // モックフェッチが成功レスポンスを返すように設定
        mockFetch.mockResolvedValueOnce({
            status: 200,
            json: async () => ({message: 'Track added successfully'}),
        } as Response);
        
        // POSTハンドラを呼び出し
        const response = await POST(mockRequest);
        const responseData = await response.json();
        
        // レスポンスのステータスとデータを検証
        expect(response.status).toBe(200);
        expect(responseData).toEqual({message: 'Track added successfully'});
        
        // モックフェッチが正しいURLとオプションで呼び出されたことを検証
        expect(mockFetch).toHaveBeenCalledWith(
            `${process.env.BACKEND_URL}/api/playlist/add-track`,
            expect.objectContaining({
                method: 'POST',
                credentials: 'include',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                    'Cookie': 'session=test',
                }),
                body: JSON.stringify({playlistId: '1', trackId: '2'}),
            })
        );
    });
    
    // バックエンドAPIがエラーを返した場合のエラーハンドリングをテスト
    it('バックエンドAPIがエラーを返した場合、適切にエラーハンドリングされること', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({playlistId: '1', trackId: '2'}),
            headers: {
                get: jest.fn().mockReturnValue('session=test'),
            },
        } as unknown as NextRequest;
        
        // モックフェッチがエラーを返すように設定
        mockFetch.mockRejectedValueOnce(new Error('Backend error'));
        
        // POSTハンドラを呼び出し
        const response = await POST(mockRequest);
        const responseData = await response.json();
        
        // レスポンスのステータスとエラーデータを検証
        expect(response.status).toBe(500);
        expect(responseData).toEqual({
            error: 'Failed to add track to playlist',
            details: 'Backend error',
        });
    });
    
    // BACKEND_URL環境変数が設定されていない場合のデフォルトURL使用をテスト
    it('BACKEND_URL環境変数が設定されていない場合、デフォルトURLを使用すること', async () => {
        delete process.env.BACKEND_URL;
        
        const mockRequest = {
            json: jest.fn().mockResolvedValue({playlistId: '1', trackId: '2'}),
            headers: {
                get: jest.fn().mockReturnValue('session=test'),
            },
        } as unknown as NextRequest;
        
        // モックフェッチが成功レスポンスを返すように設定
        mockFetch.mockResolvedValueOnce({
            status: 200,
            json: async () => ({message: 'Track added successfully'}),
        } as Response);
        
        // POSTハンドラを呼び出し
        await POST(mockRequest);
        
        // モックフェッチがデフォルトURLで呼び出されたことを検証
        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/playlist/add-track',
            expect.anything()
        );
    });
    
    // 不明なエラーが発生した場合のエラーハンドリングをテスト
    it('不明なエラーが発生した場合、適切にエラーハンドリングされること', async () => {
        const mockRequest = {
            json: jest.fn().mockRejectedValue('Unknown error'),
            headers: {
                get: jest.fn().mockReturnValue('session=test'),
            },
        } as unknown as NextRequest;
        
        // POSTハンドラを呼び出し
        const response = await POST(mockRequest);
        const responseData = await response.json();
        
        // レスポンスのステータスとエラーデータを検証
        expect(response.status).toBe(500);
        expect(responseData).toEqual({
            error: 'Failed to add track to playlist',
            details: 'Unknown error',
        });
        
        // console.errorが正しく呼び出されたことを検証
        expect(console.error).toHaveBeenCalledWith('Unknown error:', 'Unknown error');
    });
});
