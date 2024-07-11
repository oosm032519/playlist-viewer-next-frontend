// app/api/playlists/followed/route.test.ts

import {NextRequest} from 'next/server';
import {GET} from './route';
import {expect} from '@jest/globals';

// next/server モジュールをモック化し、NextRequestとNextResponseのモックを提供
jest.mock('next/server', () => ({
    NextRequest: jest.fn().mockImplementation((url, init) => ({
        url,
        headers: new Map(Object.entries(init.headers)),
    })),
    NextResponse: {
        json: jest.fn((data, init) => ({
            json: async () => data,
            status: init?.status || 200,
        })),
    },
}));

describe('GET handler', () => {
    it('should return playlists when API call is successful', async () => {
        // モックリクエストの作成
        const mockRequest = new NextRequest('http://localhost:3000/api/playlists/followed', {
            headers: {
                cookie: 'test-cookie'
            }
        });
        
        // モックのプレイリストデータ
        const mockPlaylists = [{id: 1, name: 'Playlist 1'}, {id: 2, name: 'Playlist 2'}];
        
        // fetch関数をモック化し、成功したレスポンスを返すように設定
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => mockPlaylists,
        });
        
        // GETハンドラを呼び出し、レスポンスを取得
        const response = await GET(mockRequest);
        const jsonResponse = await response.json();
        
        // レスポンスが期待通りのプレイリストデータであることを確認
        expect(jsonResponse).toEqual(mockPlaylists);
        // fetch関数が正しい引数で呼び出されたことを確認
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/playlists/followed', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Cookie': 'test-cookie',
            },
        });
    });
    
    it('should return error when API call fails', async () => {
        // モックリクエストの作成
        const mockRequest = new NextRequest('http://localhost:3000/api/playlists/followed', {
            headers: {
                cookie: 'test-cookie'
            }
        });
        
        // fetch関数をモック化し、失敗したレスポンスを返すように設定
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 500,
        });
        
        // GETハンドラを呼び出し、レスポンスを取得
        const response = await GET(mockRequest);
        const jsonResponse = await response.json();
        
        // エラーメッセージが期待通りであることを確認
        expect(jsonResponse).toEqual({
            error: 'フォロー中のプレイリストの取得中にエラーが発生しました: Failed to fetch playlists: HTTP error! status: 500'
        });
        // レスポンスのステータスコードが500であることを確認
        expect(response.status).toBe(500);
    });
    
    it('should return error when fetch throws an exception', async () => {
        // モックリクエストの作成
        const mockRequest = new NextRequest('http://localhost:3000/api/playlists/followed', {
            headers: {
                cookie: 'test-cookie'
            }
        });
        
        // fetch関数をモック化し、例外をスローするように設定
        global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
        
        // GETハンドラを呼び出し、レスポンスを取得
        const response = await GET(mockRequest);
        const jsonResponse = await response.json();
        
        // エラーメッセージが期待通りであることを確認
        expect(jsonResponse).toEqual({
            error: 'フォロー中のプレイリストの取得中にエラーが発生しました: Failed to fetch playlists: Network error'
        });
        // レスポンスのステータスコードが500であることを確認
        expect(response.status).toBe(500);
    });
});
