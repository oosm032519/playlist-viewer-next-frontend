// app/api/playlists/remove-track/route.test.ts

import {NextRequest} from 'next/server';
import {POST} from './route';
import {expect} from '@jest/globals';

// モックの設定
global.fetch = jest.fn();

describe('POST /api/playlists/remove-track', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it('should remove track from playlist successfully', async () => {
        const mockRequest = new NextRequest('http://localhost/api/playlists/remove-track', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'cookie': 'test-cookie',
            }),
            body: JSON.stringify({playlistId: '123', trackId: '456'}),
        });
        
        const mockResponse = {
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValue({success: true}),
        };
        
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
        
        const response = await POST(mockRequest);
        
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/playlist/remove-track',
            expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': 'test-cookie',
                },
                body: JSON.stringify({playlistId: '123', trackId: '456'}),
                credentials: 'include',
            })
        );
        
        expect(response.status).toBe(200);
        const responseData = await response.json();
        expect(responseData).toEqual({success: true});
    });
    
    it('should handle errors correctly', async () => {
        const mockRequest = new NextRequest('http://localhost/api/playlists/remove-track', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify({playlistId: '123', trackId: '456'}),
        });
        
        const mockErrorResponse = {
            ok: false,
            status: 500,
            json: jest.fn().mockResolvedValue({error: 'Internal Server Error'}),
        };
        
        (global.fetch as jest.Mock).mockResolvedValue(mockErrorResponse);
        
        const response = await POST(mockRequest);
        
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/playlist/remove-track',
            expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': '',
                },
                body: JSON.stringify({playlistId: '123', trackId: '456'}),
                credentials: 'include',
            })
        );
        
        expect(response.status).toBe(500);
        const responseData = await response.json();
        expect(responseData).toEqual({
            error: 'Failed to remove track from playlist',
            details: '{"error":"Internal Server Error"}',
        });
    });
});
