// app/api/playlists/remove-track/route.ts

import {NextRequest} from "next/server";

export async function POST(request: NextRequest) {
    console.log("POST request received to remove track from playlist");
    try {
        const {playlistId, trackId} = await request.json();
        console.log(`Received request to remove track ${trackId} from playlist ${playlistId}`);
        
        const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
        console.log(`Using backend URL: ${backendUrl}`);
        
        const response = await fetch(`${backendUrl}/api/playlist/remove-track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': request.headers.get('cookie') || '',
            },
            body: JSON.stringify({playlistId, trackId}),
            credentials: 'include',
        });
        
        const responseData = await response.json();
        
        if (response.ok) {
            return new Response(JSON.stringify(responseData), {
                status: response.status,
                headers: {'Content-Type': 'application/json'}
            });
        }
        
        // エラーレスポンスの場合
        throw new Error(JSON.stringify(responseData));
    } catch (error) {
        console.error("Error removing track from playlist:", error);
        let errorMessage = "Failed to remove track from playlist";
        let errorDetails = "Unknown error";
        let statusCode = 500;
        
        if (error instanceof Error) {
            try {
                errorDetails = JSON.parse(error.message);
            } catch {
                errorDetails = error.message;
            }
        }
        
        return new Response(
            JSON.stringify({error: errorMessage, details: errorDetails}),
            {status: statusCode, headers: {'Content-Type': 'application/json'}}
        );
    }
}
