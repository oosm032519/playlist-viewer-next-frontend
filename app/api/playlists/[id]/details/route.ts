// api/playlists/[id]/details/route.ts
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {getCookies, handleApiError, sendRequest} from '@/app/lib/api-utils';

export async function GET(req: NextRequest, {params}: { params: { id: string } }) {
    const {id} = params;
    try {
        const response = await sendRequest(`/api/playlists/${id}/details`, 'GET', undefined, getCookies(req));
        
        const data = await response.json();
        return NextResponse.json(data, {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error: any) {
        return handleApiError(error, 'Failed to fetch playlist details');
    }
}
