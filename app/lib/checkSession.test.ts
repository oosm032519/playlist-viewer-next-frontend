// app/lib/checkSession.test.ts

import {checkSession} from './checkSession';
import fetchMock from 'jest-fetch-mock';

// fetchをモック化
fetchMock.enableMocks();

describe('checkSession', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });
    
    it('セッションが有効な場合にtrueを返す', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({status: 'success'}));
        
        const result = await checkSession();
        
        expect(result).toBe(true);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith('/api/session/check', {
            credentials: 'include'
        });
    });
    
    it('セッションが無効な場合にfalseを返す', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({status: 'failure'}));
        
        const result = await checkSession();
        
        expect(result).toBe(false);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith('/api/session/check', {
            credentials: 'include'
        });
    });
    
    it('ネットワークエラーの場合にfalseを返す', async () => {
        fetchMock.mockRejectOnce(new Error('Network error'));
        
        const result = await checkSession();
        
        expect(result).toBe(false);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith('/api/session/check', {
            credentials: 'include'
        });
    });
    
    it('JSONパースエラーの場合にfalseを返す', async () => {
        fetchMock.mockResponseOnce('Invalid JSON');
        
        const result = await checkSession();
        
        expect(result).toBe(false);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith('/api/session/check', {
            credentials: 'include'
        });
    });
    
    it('予期せぬレスポンス形式の場合にfalseを返す', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({unexpectedKey: 'value'}));
        
        const result = await checkSession();
        
        expect(result).toBe(false);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith('/api/session/check', {
            credentials: 'include'
        });
    });
    
    it('コンソールエラーが正しく出力される', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        const testError = new Error('Test error');
        fetchMock.mockRejectOnce(testError);
        
        await checkSession();
        
        expect(consoleErrorSpy).toHaveBeenCalledWith('セッションチェックエラー:', testError);
        consoleErrorSpy.mockRestore();
    });
    
    it('fetchが正しいオプションで呼び出される', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({status: 'success'}));
        
        await checkSession();
        
        expect(fetchMock).toHaveBeenCalledWith('/api/session/check', {
            credentials: 'include'
        });
    });
});
