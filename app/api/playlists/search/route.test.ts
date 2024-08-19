// app/api/playlists/search/route.test.ts

import {GET} from './route';
import {NextRequest} from 'next/server';
import * as apiUtils from '@/app/lib/api-utils';
import {BadRequestError} from '@/app/lib/errors';
import {expect} from '@jest/globals'

// モックの設定
jest.mock('next/server', () => ({
    NextRequest: jest.fn(),
    NextResponse: {
        json: jest.fn((data) => ({json: () => data})),
    },
}));

jest.mock('@/app/lib/api-utils', () => ({
    handleApiError: jest.fn(),
}));

// フェッチのモック
global.fetch = jest.fn();

describe('GET /api/playlists/search', () => {
    let mockRequest: jest.Mocked<NextRequest>;
    let originalEnv: NodeJS.ProcessEnv;
    
    beforeEach(() => {
        jest.clearAllMocks();
        mockRequest = {
            url: 'http://localhost:3000/api/playlists/search?query=test&offset=0&limit=20',
            nextUrl: {
                searchParams: new URLSearchParams('query=test&offset=0&limit=20'),
            },
        } as unknown as jest.Mocked<NextRequest>;
        originalEnv = process.env;
        process.env = {...originalEnv};
        delete process.env.NEXT_PUBLIC_BACKEND_URL; // 環境変数をクリア
    });
    
    afterEach(() => {
        process.env = originalEnv; // テスト後に元の環境変数を復元
    });
    
    it('正常にプレイリストを検索できる場合', async () => {
        const mockResponseData = {playlists: [{id: '1', name: 'Test Playlist'}]};
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockResponseData),
        });
        
        const response = await GET(mockRequest);
        const responseData = await response.json();
        
        expect(responseData).toEqual(mockResponseData);
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/playlists/search?query=test&offset=0&limit=20',
            expect.objectContaining({
                method: 'GET',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                }),
            })
        );
    });
    
    it('クエリパラメータが指定されていない場合', async () => {
        mockRequest = {
            url: 'http://localhost:3000/api/playlists/search',
            nextUrl: {
                searchParams: new URLSearchParams(''),
            },
        } as unknown as jest.Mocked<NextRequest>;
        
        await GET(mockRequest);
        
        expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
    
    it('バックエンドAPIがエラーを返す場合', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: jest.fn().mockResolvedValueOnce({details: 'Backend error'}),
        });
        
        await GET(mockRequest);
        
        expect(apiUtils.handleApiError).toHaveBeenCalledWith(expect.any(Error));
    });
    
    it('環境変数NEXT_PUBLIC_BACKEND_URLが設定されている場合', async () => {
        // テストの実行前に環境変数を設定
        process.env.NEXT_PUBLIC_BACKEND_URL = 'http://custom-backend.com';
        
        const mockResponseData = {playlists: [{id: '1', name: 'Test Playlist'}]};
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockResponseData),
        });
        
        // GETリクエストを実行する前にモジュールをリロード
        jest.resetModules();
        const {GET: reloadedGET} = require('./route');
        
        await reloadedGET(mockRequest);
        
        expect(global.fetch).toHaveBeenCalledWith(
            'http://custom-backend.com/api/playlists/search?query=test&offset=0&limit=20',
            expect.anything()
        );
    });
});
