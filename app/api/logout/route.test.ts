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
    
    beforeEach(() => {
        req = {
            method: 'POST',
            headers: new Headers({
                'cookie': 'test-cookie',
            }),
        };
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it('正常にログアウトできること', async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({}),
        });
        
        const response = await POST(req as Request);
        
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
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({message: 'ログアウトしました'});
    });
    
    it('ログアウト中にエラーが発生した場合、500エラーを返すこと', async () => {
        global.fetch = jest.fn().mockRejectedValueOnce(new Error('ログアウトエラー'));
        
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        
        const response = await POST(req as Request);
        
        expect(consoleSpy).toHaveBeenNthCalledWith(1, 'APIリクエスト中にエラーが発生しました:', new Error('ログアウトエラー'));
        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({error: 'ログアウト失敗: ログアウトエラー'});
        
        consoleSpy.mockRestore();
    });
    
    it('POSTメソッド以外のリクエストに対して405エラーを返すこと', async () => {
        const getReq = new Request('http://localhost:3000/api/logout', {
            method: 'GET',
            headers: new Headers({
                'cookie': 'test-cookie',
            }),
        });
        
        const response = await POST(getReq);
        
        expect(response.status).toBe(405);
        expect(await response.json()).toEqual({error: 'Method GET Not Allowed'});
    });
    
    it('fetchのPOSTリクエストが正しいパラメータで呼び出されること', async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({}),
        });
        
        const response = await POST(req as Request);
        
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
        const putReq = new Request('http://localhost:3000/api/logout', {
            method: 'PUT',
            headers: new Headers({
                'cookie': 'test-cookie',
            }),
        });
        
        const response = await POST(putReq);
        
        expect(response.status).toBe(405);
        expect(await response.json()).toEqual({error: 'Method PUT Not Allowed'});
    });
});
