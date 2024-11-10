// app/api/session/check/route.ts

import {NextRequest} from 'next/server';
import {getCookies, handleApiError, sendRequest} from '@/app/lib/api-utils';

/**
 * レスポンスを生成する関数
 *
 * @param body - レスポンスボディ
 * @param status - HTTPステータスコード（デフォルトは200）
 * @returns NextResponseオブジェクト
 */
function createResponse(body: any, status: number = 200): Response {
    const response = new Response(JSON.stringify(body), {
        status: status,
        headers: {'Content-Type': 'application/json'}
    });
    
    // キャッシュを無効化するためのヘッダーを設定
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;
}

/**
 * セッションをチェックするGETリクエストハンドラー
 *
 * @param request - Next.jsのNextRequestオブジェクト
 * @returns セッションの状態を含むNextResponseオブジェクト
 */
export async function GET(request: NextRequest): Promise<Response> {
    
    try {
        // Cookieを取得
        const cookies = getCookies(request);
        
        // バックエンドのセッションチェックAPIを呼び出し
        const response = await sendRequest('/api/session/check', 'GET', undefined, cookies);
        
        // レスポンスデータをJSONとして取得
        const data = await response.json();
        
        return createResponse(data);
    } catch (error) {
        return handleApiError(error);
    }
}
