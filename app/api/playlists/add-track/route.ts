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
    console.log(`[${new Date().toISOString()}] POST リクエスト開始: /api/playlists/add-track`);
    try {
        // リクエストボディからplaylistIdとtrackIdを取得
        const {playlistId, trackId} = await request.json();
        console.log(`[${new Date().toISOString()}] リクエストボディ解析完了: playlistId=${playlistId}, trackId=${trackId}`);
        
        // Cookieを取得
        const cookies = getCookies(request);
        
        // バックエンドAPIにPOSTリクエストを送信
        console.log(`[${new Date().toISOString()}] バックエンドAPIリクエスト開始: /api/playlist/add-track`);
        const response = await sendRequest('/api/playlist/add-track', 'POST', {playlistId, trackId}, cookies);
        console.log(`[${new Date().toISOString()}] バックエンドAPIレスポンス受信: ステータス=${response.status}`);
        
        // 成功した場合のレスポンスデータを取得
        const data = await response.json();
        console.log(`[${new Date().toISOString()}] バックエンドAPIレスポンス内容:`, JSON.stringify(data));
        
        // クライアントへのレスポンスを送信
        console.log(`[${new Date().toISOString()}] クライアントへのレスポンス送信: ステータス=${response.status}`);
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        // エラーハンドリング
        return handleApiError(error);
    } finally {
        console.log(`[${new Date().toISOString()}] POST リクエスト終了: /api/playlists/add-track`);
    }
});
