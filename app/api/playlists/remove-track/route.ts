// app/api/playlists/remove-track/route.ts

import {NextRequest} from "next/server";
import {withAuth} from '@/app/middleware/auth';
import {getCookies, handleApiError, sendRequest} from '@/app/lib/api-utils';

/**
 * プレイリストからトラックを削除するためのAPIエンドポイント。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト。JSONボディにplaylistIdとtrackIdを含む。
 * @returns {Promise<Response>} - 操作の結果を示すHTTPレスポンス。
 */
export const POST = withAuth(async (request: NextRequest): Promise<Response> => {
    try {
        // リクエストボディからplaylistIdとtrackIdを取得
        const {playlistId, trackId} = await request.json();
        
        // Cookieを取得
        const cookies = getCookies(request);
        
        // バックエンドにトラック削除リクエストを送信
        const response = await sendRequest('/api/playlist/remove-track', 'POST', {playlistId, trackId}, cookies);
        
        // OKの場合は、レスポンスをJSONとして解析し、クライアントに返す
        const responseData = await response.json();
        return new Response(JSON.stringify(responseData), {
            status: response.status,
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        // エラーをハンドリングし、適切なレスポンスを返す
        return handleApiError(error);
    }
});
