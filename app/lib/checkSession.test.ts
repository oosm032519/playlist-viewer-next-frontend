// app/lib/checkSession.test.ts

import {checkSession} from './checkSession';
import fetchMock from 'jest-fetch-mock';
import {expect} from '@jest/globals';

// fetchをモック化
fetchMock.enableMocks();

describe('checkSession', () => {
    // 各テストの前にfetchMockの状態をリセットする
    beforeEach(() => {
        fetchMock.resetMocks();
    });
    
    it('セッションが有効な場合にtrueを返す', async () => {
        // モックレスポンスを設定（成功の場合）
        fetchMock.mockResponseOnce(JSON.stringify({status: 'success'}));
        
        // checkSession関数を呼び出し
        const result = await checkSession();
        
        // 結果がtrueであることを確認
        expect(result).toBe(true);
        // fetchが1回呼び出されたことを確認
        expect(fetchMock).toHaveBeenCalledTimes(1);
        // fetchが正しいURLとオプションで呼び出されたことを確認
        expect(fetchMock).toHaveBeenCalledWith('/api/session/check', {
            credentials: 'include'
        });
    });
    
    it('セッションが無効な場合にfalseを返す', async () => {
        // モックレスポンスを設定（失敗の場合）
        fetchMock.mockResponseOnce(JSON.stringify({status: 'failure'}));
        
        // checkSession関数を呼び出し
        const result = await checkSession();
        
        // 結果がfalseであることを確認
        expect(result).toBe(false);
        // fetchが1回呼び出されたことを確認
        expect(fetchMock).toHaveBeenCalledTimes(1);
        // fetchが正しいURLとオプションで呼び出されたことを確認
        expect(fetchMock).toHaveBeenCalledWith('/api/session/check', {
            credentials: 'include'
        });
    });
    
    it('ネットワークエラーの場合にfalseを返す', async () => {
        // モックレスポンスを設定（ネットワークエラーの場合）
        fetchMock.mockRejectOnce(new Error('Network error'));
        
        // checkSession関数を呼び出し
        const result = await checkSession();
        
        // 結果がfalseであることを確認
        expect(result).toBe(false);
        // fetchが1回呼び出されたことを確認
        expect(fetchMock).toHaveBeenCalledTimes(1);
        // fetchが正しいURLとオプションで呼び出されたことを確認
        expect(fetchMock).toHaveBeenCalledWith('/api/session/check', {
            credentials: 'include'
        });
    });
    
    it('JSONパースエラーの場合にfalseを返す', async () => {
        // モックレスポンスを設定（無効なJSONの場合）
        fetchMock.mockResponseOnce('Invalid JSON');
        
        // checkSession関数を呼び出し
        const result = await checkSession();
        
        // 結果がfalseであることを確認
        expect(result).toBe(false);
        // fetchが1回呼び出されたことを確認
        expect(fetchMock).toHaveBeenCalledTimes(1);
        // fetchが正しいURLとオプションで呼び出されたことを確認
        expect(fetchMock).toHaveBeenCalledWith('/api/session/check', {
            credentials: 'include'
        });
    });
    
    it('予期せぬレスポンス形式の場合にfalseを返す', async () => {
        // モックレスポンスを設定（予期せぬレスポンス形式の場合）
        fetchMock.mockResponseOnce(JSON.stringify({unexpectedKey: 'value'}));
        
        // checkSession関数を呼び出し
        const result = await checkSession();
        
        // 結果がfalseであることを確認
        expect(result).toBe(false);
        // fetchが1回呼び出されたことを確認
        expect(fetchMock).toHaveBeenCalledTimes(1);
        // fetchが正しいURLとオプションで呼び出されたことを確認
        expect(fetchMock).toHaveBeenCalledWith('/api/session/check', {
            credentials: 'include'
        });
    });
    
    it('コンソールエラーが正しく出力される', async () => {
        // console.errorをスパイしてモック化
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        const testError = new Error('Test error');
        // モックレスポンスを設定（エラーの場合）
        fetchMock.mockRejectOnce(testError);
        
        // checkSession関数を呼び出し
        await checkSession();
        
        // console.errorが正しく呼び出されたことを確認
        expect(consoleErrorSpy).toHaveBeenCalledWith('セッションチェックエラー:', testError);
        // スパイを元に戻す
        consoleErrorSpy.mockRestore();
    });
    
    it('fetchが正しいオプションで呼び出される', async () => {
        // モックレスポンスを設定（成功の場合）
        fetchMock.mockResponseOnce(JSON.stringify({status: 'success'}));
        
        // checkSession関数を呼び出し
        await checkSession();
        
        // fetchが正しいURLとオプションで呼び出されたことを確認
        expect(fetchMock).toHaveBeenCalledWith('/api/session/check', {
            credentials: 'include'
        });
    });
});
