// app/api/logout/route.test.ts

import axios, {AxiosError} from 'axios';
import {POST} from './route';
import {expect} from '@jest/globals';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

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
        mockedAxios.post.mockResolvedValueOnce({data: {}});
        
        const response = await POST(req as Request);
        
        expect(mockedAxios.post).toHaveBeenCalledWith(
            'http://localhost:8080/api/logout',
            {},
            {
                withCredentials: true,
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
        const axiosError = new AxiosError('ログアウトエラー');
        mockedAxios.post.mockRejectedValueOnce(axiosError);
        
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        
        const response = await POST(req as Request);
        
        expect(consoleSpy).toHaveBeenNthCalledWith(1, 'APIリクエスト中にエラーが発生しました:', axiosError);
        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({error: 'ログアウト失敗: ログアウトエラー'});
        
        consoleSpy.mockRestore();
    });
    
    it('POSTメソッド以外のリクエストに対して405エラーを返すこと', async () => {
        // 新しいRequestオブジェクトを作成して、methodを設定
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
    
    it('axiosのPOSTリクエストが正しいパラメータで呼び出されること', async () => {
        mockedAxios.post.mockResolvedValueOnce({data: {}});
        
        const response = await POST(req as Request);
        
        expect(mockedAxios.post).toHaveBeenCalledWith(
            'http://localhost:8080/api/logout',
            {},
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': 'test-cookie',
                },
            }
        );
    });
    
    it('レスポンスヘッダーが正しく設定されること', async () => {
        // 新しいRequestオブジェクトを作成して、methodを設定
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
