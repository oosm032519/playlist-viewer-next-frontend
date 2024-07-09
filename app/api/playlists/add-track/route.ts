import {NextRequest} from "next/server";

export async function POST(request: NextRequest) {
    try {
        const {playlistId, trackId} = await request.json();
        
        // バックエンドAPIのエンドポイントURL
        const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
        
        const response = await fetch(`${backendUrl}/api/playlist/add-track`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': request.headers.get('cookie') || '',
            },
            body: JSON.stringify({playlistId, trackId}),
        });
        
        const data = await response.json();
        
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error adding track to playlist:", error.message);
            return new Response(
                JSON.stringify({error: "Failed to add track to playlist", details: error.message}),
                {status: 500, headers: {'Content-Type': 'application/json'}}
            );
        } else {
            console.error("Unknown error:", error);
            return new Response(
                JSON.stringify({error: "Failed to add track to playlist", details: "Unknown error"}),
                {status: 500, headers: {'Content-Type': 'application/json'}}
            );
        }
    }
}
