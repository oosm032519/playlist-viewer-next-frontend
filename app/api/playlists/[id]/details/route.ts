// api/playlists/[id]/details/route.ts
import {NextResponse} from 'next/server';
import type {NextApiRequest} from 'next'

export async function GET(req: NextApiRequest, {params}: { params: { id: string } }) {
    const {id} = params;
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        const response = await fetch(`${backendUrl}/api/playlists/${id}/details`, {
            credentials: 'include',
        });
        
        if (!response.ok) {
            const errorData = await response.json(); // エラーメッセージがあれば取得
            return new NextResponse(JSON.stringify(errorData), {
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
        return new NextResponse(JSON.stringify({error: 'Failed to fetch playlist details', details: error.message}), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        });
    }
}
