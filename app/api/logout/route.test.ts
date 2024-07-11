// app/api/logout/route.test.ts

import {POST} from './route';
import {expect} from '@jest/globals';

// NextResponseをモックする
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((data, init) => ({
            json: async () => data,
            status: init.status,
        })),
    },
}));

describe('Session API Route', () => {
    let req: Partial<Request>;
    
    // 各テストの前にリクエストオブジェクトを初期化
    beforeEach(() => {
        req = {
            method: 'POST',
            headers: new Headers({
                'cookie': 'test-cookie',
            }),
        };
    });
    
    // 各テストの後にモックをクリア
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it('正常にログアウトできること', async () => {
        // fetchをモックして成功レスポンスを返す
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({}),
        });
        
        // POST関数を呼び出してレスポンスを取得
        const response = await POST(req as Request);
        
        // fetchが正しいURLとオプションで呼び出されたことを確認
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/logout',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': 'test-cookie',
                },
            }
        );
        // レスポンスのステータスと内容を確認
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({message: 'ログアウトしました'});
    });
    
    it('ログアウト中にエラーが発生した場合、500エラーを返すこと', async () => {
        // fetchをモックしてエラーを投げる
        global.fetch = jest.fn().mockRejectedValueOnce(new Error('ログアウトエラー'));
        
        // console.errorをスパイしてエラーが正しくログに出力されることを確認
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        
        // POST関数を呼び出してレスポンスを取得
        const response = await POST(req as Request);
        
        // エラーメッセージが正しくログに出力されることを確認
        expect(consoleSpy).toHaveBeenNthCalledWith(1, 'APIリクエスト中にエラーが発生しました:', new Error('ログアウトエラー'));
        // レスポンスのステータスと内容を確認
        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({error: 'ログアウト失敗: ログアウトエラー'});
        
        // スパイを元に戻す
        consoleSpy.mockRestore();
    });
    
    it('POSTメソッド以外のリクエストに対して405エラーを返すこと', async () => {
        // GETリクエストを作成
        const getReq = new Request('http://localhost:3000/api/logout', {
            method: 'GET',
            headers: new Headers({
                'cookie': 'test-cookie',
            }),
        });
        
        // POST関数を呼び出してレスポンスを取得
        const response = await POST(getReq);
        
        // レスポンスのステータスと内容を確認
        expect(response.status).toBe(405);
        expect(await response.json()).toEqual({error: 'Method GET Not Allowed'});
    });
    
    it('fetchのPOSTリクエストが正しいパラメータで呼び出されること', async () => {
        // fetchをモックして成功レスポンスを返す
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({}),
        });
        
        // POST関数を呼び出してレスポンスを取得
        const response = await POST(req as Request);
        
        // fetchが正しいURLとオプションで呼び出されたことを確認
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/logout',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': 'test-cookie',
                },
            }
        );
    });
    
    it('レスポンスヘッダーが正しく設定されること', async () => {
        // PUTリクエストを作成
        const putReq = new Request('http://localhost:3000/api/logout', {
            method: 'PUT',
            headers: new Headers({
                'cookie': 'test-cookie',
            }),
        });
        
        // POST関数を呼び出してレスポンスを取得
        const response = await POST(putReq);
        
        // レスポンスのステータスと内容を確認
        expect(response.status).toBe(405);
        expect(await response.json()).toEqual({error: 'Method PUT Not Allowed'});
    });
});
