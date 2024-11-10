// app/api/playlists/recommendations/route.ts

import {NextResponse, NextRequest} from 'next/server';

// リクエストボディの型定義
interface RecommendationRequest {
    seedArtists: string[];
    maxAudioFeatures: { [key: string]: number };
    minAudioFeatures: { [key: string]: number };
}

export async function POST(request: NextRequest) {
    try {
        const requestBody: RecommendationRequest = await request.json();
        
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        const response = await fetch(`${backendUrl}/api/playlists/recommendations`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestBody),
            credentials: 'include',
        });
        
        if (!response.ok) {  // レスポンスが失敗した場合
            const errorData = await response.json(); // エラーレスポンスをJSONとして解析
            console.error("Fetch error:", response.status, errorData);
            return new NextResponse(JSON.stringify(errorData), { // エラーレスポンスを返す
                status: response.status,
                headers: {'Content-Type': 'application/json'}
            });
        }
        
        const data = await response.json();
        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        });
        
    } catch (error: any) {
        console.error("Fetch error:", error);
        return new NextResponse(JSON.stringify({error: 'Failed to fetch recommendations', details: error.message}), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        });
    }
}
