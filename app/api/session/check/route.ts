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
    console.log(`[${new Date().toISOString()}] GET /api/session/check - リクエスト開始`);
    
    try {
        // Cookieを取得
        const cookies = getCookies(request);
        console.log(`[${new Date().toISOString()}] 受け取ったCookie: ${cookies}`);
        
        // バックエンドのセッションチェックAPIを呼び出し
        const response = await sendRequest('/api/session/check', 'GET', undefined, cookies);
        
        console.log(`[${new Date().toISOString()}] APIレスポンスステータス: ${response.status}`);
        
        // レスポンスデータをJSONとして取得
        const data = await response.json();
        console.log(`[${new Date().toISOString()}] APIレスポンスデータを取得: ${JSON.stringify(data)}`);
        
        console.log(`[${new Date().toISOString()}] セッションの状態を含むレスポンスを返す`);
        return createResponse(data);
    } catch (error) {
        // エラー発生時の処理
        return handleApiError(error);
    } finally {
        console.log(`[${new Date().toISOString()}] GET /api/session/check - リクエスト終了`);
    }
}
