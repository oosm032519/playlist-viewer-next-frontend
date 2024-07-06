import {POST} from './route';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {NextRequest} from 'next/server';
import {expect} from '@jest/globals';

// axios のモックを作成
const mock = new MockAdapter(axios);

describe('POST /api/playlist/add-track', () => {
    beforeEach(() => {
        mock.reset();
        process.env.BACKEND_URL = 'http://test-backend.com';
    });
    
    it('正常にトラックをプレイリストに追加できること', async () => {
        const mockPlaylistId = 'playlist123';
        const mockTrackId = 'track456';
        const mockResponseData = {message: 'Track added successfully'};
        
        mock.onPost('http://test-backend.com/api/playlist/add-track').reply(200, mockResponseData);
        
        const request = new NextRequest('http://localhost:3000/api/playlist/add-track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': 'session=test-session',
            },
            body: JSON.stringify({playlistId: mockPlaylistId, trackId: mockTrackId}),
        });
        
        const response = await POST(request);
        const responseData = await response.json();
        
        expect(response.status).toBe(200);
        expect(responseData).toEqual(mockResponseData);
    });
    
    it('バックエンドAPIがエラーを返した場合、500エラーを返すこと', async () => {
        mock.onPost('http://test-backend.com/api/playlist/add-track').reply(500);
        
        const request = new NextRequest('http://localhost:3000/api/playlist/add-track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({playlistId: 'playlist123', trackId: 'track456'}),
        });
        
        const response = await POST(request);
        const responseData = await response.json();
        
        expect(response.status).toBe(500);
        expect(responseData.error).toBe('Failed to add track to playlist');
        expect(responseData.details).toBe('Request failed with status code 500');
    });
    
    it('BACKEND_URL環境変数が設定されていない場合、デフォルトURLを使用すること', async () => {
        delete process.env.BACKEND_URL;
        
        mock.onPost('http://localhost:8080/api/playlist/add-track').reply(200, {message: 'Success'});
        
        const request = new NextRequest('http://localhost:3000/api/playlist/add-track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({playlistId: 'playlist123', trackId: 'track456'}),
        });
        
        const response = await POST(request);
        
        expect(response.status).toBe(200);
    });
});
