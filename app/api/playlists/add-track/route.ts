// app/api/playlists/add-track/route.ts

import {NextRequest} from "next/server";
import {withAuth} from '@/app/middleware/auth';
import {getCookies, handleApiError, sendRequest} from '@/app/lib/api-utils';

/**
 * プレイリストにトラックを追加するためのAPIエンドポイント。
 *
 * @param request - クライアントからのHTTPリクエスト
 * @returns プレイリストにトラックを追加した結果を含むHTTPレスポンス
 */
export const POST = withAuth(async (request: NextRequest): Promise<Response> => {
    try {
        // リクエストボディからplaylistIdとtrackIdを取得
        const {playlistId, trackId} = await request.json();
        
        // Cookieを取得
        const cookies = getCookies(request);
        
        // バックエンドAPIにPOSTリクエストを送信
        const response = await sendRequest('/api/playlist/add-track', 'POST', {playlistId, trackId}, cookies);
        
        // 成功した場合のレスポンスデータを取得
        const data = await response.json();
        
        // クライアントへのレスポンスを送信
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        // エラーハンドリング
        return handleApiError(error);
    }
});
