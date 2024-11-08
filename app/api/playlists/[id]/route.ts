// app/api/playlists/[id]/route.ts

import {NextRequest} from 'next/server';
import {handleApiError, sendRequest} from '@/app/lib/api-utils';

// プレイリスト詳細データ取得
const fetchPlaylistDetails = async (id: string): Promise<Response> => {
    const fullUrl = `/api/playlists/${id}/details`; // detailsを追加
    console.log(`フルURL: ${fullUrl}`);
    
    try {
        const response = await sendRequest(fullUrl, 'GET');
        if (!response.ok) {
            if (response.status === 404) {
                return new Response(JSON.stringify({error: 'プレイリストが見つかりません'}), {status: 404});
            }
            throw new Error(`プレイリスト詳細の取得に失敗しました: ${response.status}`);
        }
        return new Response(JSON.stringify(await response.json()), {
            status: response.status,
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        return handleApiError(error);
    }
};


export async function GET(
    request: NextRequest,
    {params}: { params: { id: string } }
): Promise<Response> {
    return fetchPlaylistDetails(params.id);
}
