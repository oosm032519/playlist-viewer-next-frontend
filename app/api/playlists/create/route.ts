// app/api/playlists/create/route.ts

import {NextRequest} from "next/server";

export async function POST(request: NextRequest) {
    try {
        const trackIds: string[] = await request.json();
        
        // バックエンドAPIのエンドポイントURL
        const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
        
        const response = await fetch(`${backendUrl}/api/playlists/create`, {
            method: 'POST',
            headers: {
                'Cookie': request.headers.get('cookie') || '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(trackIds),
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error creating playlist:", error.message);
            return new Response(
                JSON.stringify({error: "Failed to create playlist", details: error.message}),
                {status: 500, headers: {'Content-Type': 'application/json'}}
            );
        } else {
            console.error("Unknown error:", error);
            return new Response(
                JSON.stringify({error: "Failed to create playlist", details: "Unknown error"}),
                {status: 500, headers: {'Content-Type': 'application/json'}}
            );
        }
    }
}
