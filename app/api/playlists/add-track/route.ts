import {NextRequest, NextResponse} from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
    try {
        const {playlistId, trackId} = await request.json();
        
        // バックエンドAPIのエンドポイントURL
        const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
        
        const response = await axios.post(
            `${backendUrl}/api/playlist/add-track`,
            {playlistId, trackId},
            {
                withCredentials: true,
                headers: {
                    'Cookie': request.headers.get('cookie') || '',
                },
            }
        );
        
        return new Response(JSON.stringify(response.data), {
            status: response.status,
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        console.error("Error adding track to playlist:", error);
        return new Response(
            JSON.stringify({error: "Failed to add track to playlist"}),
            {status: 500, headers: {'Content-Type': 'application/json'}}
        );
    }
}
