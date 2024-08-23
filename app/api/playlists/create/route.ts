// app/api/playlists/create/route.ts

import {NextRequest} from "next/server";
import {withAuth} from '@/app/middleware/auth';
import {getCookies, handleApiError, sendRequest} from '@/app/lib/api-utils';

/**
 * プレイリスト作成のためのPOSTメソッドを処理する非同期関数
 *
 * @param {NextRequest} request - クライアントからのリクエスト
 * @returns {Promise<Response>} - 作成されたプレイリストのレスポンス
 */
export const POST = withAuth(async (request: NextRequest): Promise<Response> => {
    try {
        // リクエストボディからトラックIDの配列を取得
        const trackIds: string[] = await request.json();
        
        // Cookieを取得
        const cookies = getCookies(request);
        
        // バックエンドAPIに対してプレイリスト作成リクエストを送信
        const response = await sendRequest('/api/playlists/create', 'POST', trackIds, cookies);
        
        // レスポンスボディをJSONとしてパース
        const data = await response.json();
        
        // 成功したレスポンスを返す
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        // エラーを処理し、適切なレスポンスを返す
        return handleApiError(error);
    }
});
