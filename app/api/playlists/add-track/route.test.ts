import {POST} from './route';
import {NextRequest} from 'next/server';
import {expect} from '@jest/globals';

// モックフェッチ関数の型定義
type MockFetch = jest.Mock<Promise<Response>, [input: RequestInfo | URL, init?: RequestInit | undefined]>;

describe('POST handler', () => {
    let mockFetch: MockFetch;
    let originalFetch: typeof global.fetch;
    let originalEnv: NodeJS.ProcessEnv;
    
    beforeAll(() => {
        originalFetch = global.fetch;
        originalEnv = process.env;
    });
    
    beforeEach(() => {
        mockFetch = jest.fn();
        global.fetch = mockFetch as unknown as typeof global.fetch;
        process.env = {...originalEnv, BACKEND_URL: 'http://test-backend.com'};
    });
    
    afterEach(() => {
        jest.resetAllMocks();
    });
    
    afterAll(() => {
        global.fetch = originalFetch;
        process.env = originalEnv;
    });
    
    it('正常にトラックをプレイリストに追加できること', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({playlistId: '1', trackId: '2'}),
            headers: {
                get: jest.fn().mockReturnValue('session=test'),
            },
        } as unknown as NextRequest;
        
        mockFetch.mockResolvedValueOnce({
            status: 200,
            json: async () => ({message: 'Track added successfully'}),
        } as Response);
        
        const response = await POST(mockRequest);
        const responseData = await response.json();
        
        expect(response.status).toBe(200);
        expect(responseData).toEqual({message: 'Track added successfully'});
        expect(mockFetch).toHaveBeenCalledWith(
            'http://test-backend.com/api/playlist/add-track',
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
    
    it('バックエンドAPIがエラーを返した場合、適切にエラーハンドリングされること', async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({playlistId: '1', trackId: '2'}),
            headers: {
                get: jest.fn().mockReturnValue('session=test'),
            },
        } as unknown as NextRequest;
        
        mockFetch.mockRejectedValueOnce(new Error('Backend error'));
        
        const response = await POST(mockRequest);
        const responseData = await response.json();
        
        expect(response.status).toBe(500);
        expect(responseData).toEqual({
            error: 'Failed to add track to playlist',
            details: 'Backend error',
        });
    });
    
    it('BACKEND_URL環境変数が設定されていない場合、デフォルトURLを使用すること', async () => {
        delete process.env.BACKEND_URL;
        
        const mockRequest = {
            json: jest.fn().mockResolvedValue({playlistId: '1', trackId: '2'}),
            headers: {
                get: jest.fn().mockReturnValue('session=test'),
            },
        } as unknown as NextRequest;
        
        mockFetch.mockResolvedValueOnce({
            status: 200,
            json: async () => ({message: 'Track added successfully'}),
        } as Response);
        
        await POST(mockRequest);
        
        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/playlist/add-track',
            expect.anything()
        );
    });
});
