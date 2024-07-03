import {GET} from '@/app/api/session/route';
import fetchMock from 'jest-fetch-mock';

// NextResponseをモック化
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((body, init) => ({
            json: () => Promise.resolve(body),
            status: init?.status || 200,
        })),
    },
}));

// fetchをモック化
fetchMock.enableMocks();

describe('Session API Route', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        jest.clearAllMocks();
    });
    
    it('正常なレスポンスを返すべき', async () => {
        const mockData = {status: 'active', userId: '123'};
        fetchMock.mockResponseOnce(JSON.stringify(mockData));
        
        const response = await GET();
        const data = await response.json();
        
        expect(response.status).toBe(200);
        expect(data).toEqual(mockData);
        expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/session/check', {
            credentials: 'include',
        });
    });
    
    it('外部APIがエラーを返した場合、エラーレスポンスを返すべき', async () => {
        fetchMock.mockRejectOnce(new Error('Network error'));
        
        const response = await GET();
        const data = await response.json();
        
        expect(response.status).toBe(500);
        expect(data).toEqual({
            status: 'error',
            message: 'セッションチェックに失敗しました',
        });
    });
    
    it('外部APIからの無効なJSONレスポンスを処理すべき', async () => {
        fetchMock.mockResponseOnce('Invalid JSON');
        
        const response = await GET();
        const data = await response.json();
        
        expect(response.status).toBe(500);
        expect(data).toEqual({
            status: 'error',
            message: 'セッションチェックに失敗しました',
        });
    });
    
    it('外部APIからの予期しないステータスコードを処理すべき', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({error: 'Unauthorized'}), {status: 401});
        
        const response = await GET();
        const data = await response.json();
        
        expect(response.status).toBe(200);
        expect(data).toEqual({error: 'Unauthorized'});
    });
    
    it('クレデンシャルが正しく設定されているか確認すべき', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}));
        
        await GET();
        
        expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/session/check', {
            credentials: 'include',
        });
    });
    
    it('コンソールにエラーがログされるべき', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        fetchMock.mockRejectOnce(new Error('Network error'));
        
        await GET();
        
        expect(consoleSpy).toHaveBeenCalledWith('セッションチェックエラー:', expect.any(Error));
        consoleSpy.mockRestore();
    });
});
