// api/playlists/[id]/details/route.ts
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {handleApiError} from '@/app/lib/api-utils';

export async function GET(req: NextRequest, {params}: { params: { id: string } }) {
    const {id} = params;
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        const response = await fetch(`${backendUrl}/api/playlists/${id}/details`, {
            credentials: 'include',
        });
        
        if (!response.ok) {
            const errorData = await response.json();  // エラーメッセージがあれば取得
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
        return handleApiError(error, 'Failed to fetch playlist details');
    }
}
