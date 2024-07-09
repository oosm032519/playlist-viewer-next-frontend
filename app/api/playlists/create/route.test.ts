// app/api/playlists/create/route.test.ts

import {NextRequest} from 'next/server';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {POST} from './route';
import {expect, it, describe, beforeEach} from '@jest/globals';

const mock = new MockAdapter(axios);

describe('POST /api/playlists/create', () => {
    beforeEach(() => {
        mock.reset();
    });
    
    it('正常にプレイリストを作成できる', async () => {
        const trackIds = ['1', '2', '3'];
        const mockResponse = {playlistId: '123', name: 'New Playlist'};
        
        mock.onPost('http://localhost:8080/api/playlists/create', trackIds).reply(201, mockResponse);
        
        const mockRequest = {
            json: jest.fn().mockResolvedValue(trackIds),
            headers: {
                get: jest.fn().mockReturnValue('session=123'),
            },
        } as unknown as NextRequest;
        
        const response = await POST(mockRequest);
        const responseData = await response.json();
        
        expect(response.status).toBe(201);
        expect(responseData).toEqual(mockResponse);
    });
    
    it('バックエンドAPIがエラーを返した場合、適切なエラーレスポンスを返す', async () => {
        const trackIds = ['1', '2', '3'];
        
        mock.onPost('http://localhost:8080/api/playlists/create', trackIds).reply(500, {error: 'Internal Server Error'});
        
        const mockRequest = {
            json: jest.fn().mockResolvedValue(trackIds),
            headers: {
                get: jest.fn().mockReturnValue('session=123'),
            },
        } as unknown as NextRequest;
        
        const response = await POST(mockRequest);
        const responseData = await response.json();
        
        expect(response.status).toBe(500);
        expect(responseData).toEqual({
            error: 'Failed to create playlist',
            details: 'Request failed with status code 500',
        });
    });
    
    it('リクエストの解析に失敗した場合、適切なエラーレスポンスを返す', async () => {
        const mockRequest = {
            json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
            headers: {
                get: jest.fn().mockReturnValue('session=123'),
            },
        } as unknown as NextRequest;
        
        const response = await POST(mockRequest);
        const responseData = await response.json();
        
        expect(response.status).toBe(500);
        expect(responseData).toEqual({
            error: 'Failed to create playlist',
            details: 'Invalid JSON',
        });
    });
});
