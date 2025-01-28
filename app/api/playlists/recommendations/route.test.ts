// app/api/playlists/recommendations/route.test.ts

import {NextRequest, NextResponse} from 'next/server';
import {POST} from '@/app/api/playlists/recommendations/route';
import * as apiUtils from '@/app/lib/api-utils';
import {expect} from '@jest/globals';

// モックの設定
jest.mock('next/server', () => ({
    NextRequest: jest.fn(),
    NextResponse: {
        json: jest.fn((data, options) => ({
            json: async () => data,
            status: options?.status || 200,
            headers: {'Content-Type': 'application/json'}
        })),
    },
}));

jest.mock('@/app/lib/api-utils', () => ({
    handleApiError: jest.fn(),
    getCookies: jest.fn(),
    sendRequest: jest.fn(),
}));

describe('POST /api/playlists/recommendations', () => {
    let mockRequest: jest.Mocked<NextRequest>;
    
    beforeEach(() => {
        jest.clearAllMocks();
        mockRequest = {
            json: jest.fn(),
            headers: {
                get: jest.fn(),
            },
        } as unknown as jest.Mocked<NextRequest>;
        process.env.NEXT_PUBLIC_BACKEND_URL = 'http://test-backend.com';
    });
    
    it('正常に推奨トラックを取得できる場合', async () => {
        const mockRequestBody = {
            seedArtists: ['artist1', 'artist2'],
            maxAudioFeatures: {danceability: 0.8},
            minAudioFeatures: {energy: 0.5},
        };
        const mockResponseData = [{id: 'track1', name: 'Track 1'}];
        
        mockRequest.json.mockResolvedValueOnce(mockRequestBody);
        (apiUtils.getCookies as jest.Mock).mockReturnValue('sessionId=test-session-id');
        (apiUtils.sendRequest as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => mockResponseData,
        });
        
        const response = await POST(mockRequest);
        
        expect(response).toHaveProperty('json');
        expect(response).toHaveProperty('status', 200);
        const responseData = await response.json();
        
        expect(responseData).toEqual(mockResponseData);
        expect(apiUtils.sendRequest).toHaveBeenCalledWith(
            '/api/playlists/recommendations',
            'POST',
            mockRequestBody,
            'sessionId=test-session-id'
        );
    });
    
    it('バックエンドAPIがエラーを返す場合', async () => {
        const mockRequestBody = {
            seedArtists: ['artist1', 'artist2'],
            maxAudioFeatures: {danceability: 0.8},
            minAudioFeatures: {energy: 0.5},
        };
        
        mockRequest.json.mockResolvedValueOnce(mockRequestBody);
        (apiUtils.getCookies as jest.Mock).mockReturnValue('sessionId=test-session-id');
        (apiUtils.sendRequest as jest.Mock).mockRejectedValueOnce(new Error('Server error'));
        (apiUtils.handleApiError as jest.Mock).mockReturnValue(NextResponse.json({error: 'Internal Server Error'}, {status: 500}));
        
        const response = await POST(mockRequest);
        
        expect(response).toHaveProperty('json');
        expect(response).toHaveProperty('status', 500);
        const responseData = await response.json();
        expect(responseData).toEqual({error: 'Internal Server Error'});
    });
});
