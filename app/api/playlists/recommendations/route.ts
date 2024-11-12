// app/api/playlists/recommendations/route.ts

import {NextResponse, NextRequest} from 'next/server';
import {getCookies, handleApiError, sendRequest} from '@/app/lib/api-utils';

// リクエストボディの型定義
interface RecommendationRequest {
    seedArtists: string[];
    maxAudioFeatures: { [key: string]: number };
    minAudioFeatures: { [key: string]: number };
}

export async function POST(request: NextRequest) {
    try {
        const requestBody: RecommendationRequest = await request.json();
        
        const response = await sendRequest('/api/playlists/recommendations', 'POST', requestBody, getCookies(request));
        
        const data = await response.json();
        return NextResponse.json(data, {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        });
        
    } catch (error: any) {
        return handleApiError(error, 'Failed to fetch recommendations');
    }
}
