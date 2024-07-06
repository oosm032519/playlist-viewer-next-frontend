// app/api/logout/route.test.ts

import {NextApiRequest, NextApiResponse} from 'next';
import axios from 'axios';
import handler from './route';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Session API Route', () => {
    let req: Partial<NextApiRequest>;
    let res: Partial<NextApiResponse>;
    
    beforeEach(() => {
        req = {
            method: 'POST',
            headers: {
                cookie: 'test-cookie',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            setHeader: jest.fn(),
            end: jest.fn(),
        };
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it('正常にログアウトできること', async () => {
        mockedAxios.post.mockResolvedValueOnce({data: {}});
        
        await handler(req as NextApiRequest, res as NextApiResponse);
        
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
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: 'ログアウトしました'});
    });
    
    it('ログアウト中にエラーが発生した場合、500エラーを返すこと', async () => {
        const error = new Error('ログアウトエラー');
        mockedAxios.post.mockRejectedValueOnce(error);
        
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        
        await handler(req as NextApiRequest, res as NextApiResponse);
        
        expect(consoleSpy).toHaveBeenNthCalledWith(1, 'APIリクエスト中にエラーが発生しました:', error);
        expect(consoleSpy).toHaveBeenNthCalledWith(2, 'POSTハンドラーでエラーが発生しました:', expect.any(Error));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: 'ログアウト中にエラーが発生しました'});
        
        consoleSpy.mockRestore();
    });
    
    it('POSTメソッド以外のリクエストに対して405エラーを返すこと', async () => {
        req.method = 'GET';
        
        await handler(req as NextApiRequest, res as NextApiResponse);
        
        expect(res.setHeader).toHaveBeenCalledWith('Allow', ['POST']);
        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.end).toHaveBeenCalledWith('Method GET Not Allowed');
    });
    
    it('axiosのPOSTリクエストが正しいパラメータで呼び出されること', async () => {
        mockedAxios.post.mockResolvedValueOnce({data: {}});
        
        await handler(req as NextApiRequest, res as NextApiResponse);
        
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
        req.method = 'PUT';
        
        await handler(req as NextApiRequest, res as NextApiResponse);
        
        expect(res.setHeader).toHaveBeenCalledWith('Allow', ['POST']);
    });
});
