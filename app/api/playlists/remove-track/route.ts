// app/api/playlists/remove-track/route.ts

import {NextRequest} from "next/server";

export async function POST(request: NextRequest) {
    console.log("POST request received to remove track from playlist");
    try {
        const {playlistId, trackId} = await request.json();
        console.log(`Received request to remove track ${trackId} from playlist ${playlistId}`);
        
        // バックエンドAPIのエンドポイントURL
        const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
        console.log(`Using backend URL: ${backendUrl}`);
        
        console.log("Sending request to backend API");
        const response = await fetch(`${backendUrl}/api/playlist/remove-track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': request.headers.get('cookie') || '',
            },
            body: JSON.stringify({playlistId, trackId}),
            credentials: 'include',
        });
        
        console.log(`Backend API response status: ${response.status}`);
        const responseData = await response.json();
        console.log("Backend API response data:", responseData);
        
        return new Response(JSON.stringify(responseData), {
            status: response.status,
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        console.error("Error removing track from playlist:", error);
        let errorMessage = "Failed to remove track from playlist";
        let errorDetails = "Unknown error";
        let statusCode = 500;
        
        if (error instanceof Error) {
            errorDetails = error.message;
        }
        
        if (error instanceof Response) {
            statusCode = error.status;
            try {
                const errorData = await error.json();
                errorDetails = JSON.stringify(errorData);
            } catch {
                // エラーレスポンスのJSONパースに失敗した場合、詳細は変更しない
            }
        }
        
        return new Response(
            JSON.stringify({error: errorMessage, details: errorDetails}),
            {status: statusCode, headers: {'Content-Type': 'application/json'}}
        );
    }
}
