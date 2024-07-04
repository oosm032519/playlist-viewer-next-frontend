// app/api/playlist/add-track/route.ts

import {NextResponse} from "next/server";
import axios from "axios";

export async function POST(request: Request) {
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
        
        return NextResponse.json(response.data, {status: response.status});
    } catch (error) {
        console.error("Error adding track to playlist:", error);
        return NextResponse.json(
            {error: "Failed to add track to playlist"},
            {status: 500}
        );
    }
}
