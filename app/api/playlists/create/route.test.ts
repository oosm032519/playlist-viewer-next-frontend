// app/api/playlists/create/route.ts.test.ts

import {NextRequest} from 'next/server';
import {POST} from './route';
import fetchMock from 'jest-fetch-mock';
import {expect} from '@jest/globals';

fetchMock.enableMocks();

describe('POST /api/playlists/create', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {
        });
    });
    
    afterEach(() => {
        jest.restoreAllMocks();
    });
    
    it('should create a playlist successfully', async () => {
        const mockResponse = {success: true, playlistId: '12345'};
        fetchMock.mockResponseOnce(JSON.stringify(mockResponse), {status: 200});
        
        const trackIds = ['track1', 'track2', 'track3'];
        const request = new NextRequest('http://localhost:3000/api/playlists/create', {
            method: 'POST',
            body: JSON.stringify(trackIds),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer mockJWT'
            }
        });
        
        const response = await POST(request);
        
        expect(response.status).toBe(200);
        const responseData = await response.json();
        expect(responseData).toEqual(mockResponse);
    });
    
    it('should handle backend errors gracefully', async () => {
        fetchMock.mockResponseOnce('Internal Server Error', {status: 500});
        
        const trackIds = ['track1', 'track2', 'track3'];
        const request = new NextRequest('http://localhost:3000/api/playlists/create', {
            method: 'POST',
            body: JSON.stringify(trackIds),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer mockJWT'
            }
        });
        
        const response = await POST(request);
        
        expect(response.status).toBe(500);
        const responseData = await response.json();
        expect(responseData).toEqual({
            error: 'Failed to create playlist',
            details: 'HTTP error! status: 500'
        });
    });
    
    it('should handle unexpected errors gracefully', async () => {
        fetchMock.mockRejectOnce(new Error('Unexpected error'));
        
        const trackIds = ['track1', 'track2', 'track3'];
        const request = new NextRequest('http://localhost:3000/api/playlists/create', {
            method: 'POST',
            body: JSON.stringify(trackIds),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer mockJWT'
            }
        });
        
        const response = await POST(request);
        
        expect(response.status).toBe(500);
        const responseData = await response.json();
        expect(responseData).toEqual({
            error: 'Failed to create playlist',
            details: 'Unexpected error'
        });
    });
    
    it('should handle unknown errors gracefully', async () => {
        fetchMock.mockRejectOnce(() => Promise.reject({} as Error));
        
        const trackIds = ['track1', 'track2', 'track3'];
        const request = new NextRequest('http://localhost:3000/api/playlists/create', {
            method: 'POST',
            body: JSON.stringify(trackIds),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer mockJWT'
            }
        });
        
        const response = await POST(request);
        
        expect(response.status).toBe(500);
        const responseData = await response.json();
        expect(responseData).toEqual({
            error: 'Failed to create playlist',
            details: 'Unknown error'
        });
        
        expect(console.error).toHaveBeenCalledWith('Unknown error:', {});
    });
});
