// app/api/playlists/remove-track/route.ts

import {NextRequest} from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
    console.log("POST request received to remove track from playlist");
    try {
        const {playlistId, trackId} = await request.json();
        console.log(`Received request to remove track ${trackId} from playlist ${playlistId}`);
        
        // バックエンドAPIのエンドポイントURL
        const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
        console.log(`Using backend URL: ${backendUrl}`);
        
        console.log("Sending request to backend API");
        const response = await axios.post(
            `${backendUrl}/api/playlist/remove-track`,
            {playlistId, trackId},
            {
                withCredentials: true,
                headers: {
                    'Cookie': request.headers.get('cookie') || '',
                },
            }
        );
        
        console.log(`Backend API response status: ${response.status}`);
        console.log("Backend API response data:", response.data);
        
        return new Response(JSON.stringify(response.data), {
            status: response.status,
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error removing track from playlist:", error.message);
            console.error("Error response:", error.response?.data);
            return new Response(
                JSON.stringify({
                    error: "Failed to remove track from playlist",
                    details: error.message,
                    response: error.response?.data
                }),
                {status: error.response?.status || 500, headers: {'Content-Type': 'application/json'}}
            );
        } else if (error instanceof Error) {
            console.error("Error removing track from playlist:", error.message);
            return new Response(
                JSON.stringify({error: "Failed to remove track from playlist", details: error.message}),
                {status: 500, headers: {'Content-Type': 'application/json'}}
            );
        } else {
            console.error("Unknown error:", error);
            return new Response(
                JSON.stringify({error: "Failed to remove track from playlist", details: "Unknown error"}),
                {status: 500, headers: {'Content-Type': 'application/json'}}
            );
        }
    }
}
