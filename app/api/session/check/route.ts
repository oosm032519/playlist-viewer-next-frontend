// app/api/session/check/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {handleApiError} from '@/app/lib/api-utils';

/**
 * レスポンスを生成する関数
 *
 * @param body - レスポンスボディ
 * @param status - HTTPステータスコード（デフォルトは200）
 * @returns NextResponseオブジェクト
 */
function createResponse(body: any, status: number = 200): NextResponse {
    const response = NextResponse.json(body, {status});
    
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
export async function GET(request: NextRequest): Promise<NextResponse> {
    console.log(`[${new Date().toISOString()}] GET /api/session/check - リクエスト開始`);
    
    try {
        // バックエンドURLを環境変数から取得
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
        console.log(`[${new Date().toISOString()}] 環境変数からバックエンドURLを取得: ${backendUrl}`);
        
        // リクエストヘッダーからCookieを取得
        const cookies = request.headers.get('cookie');
        console.log(`[${new Date().toISOString()}] 受け取ったCookie: ${cookies}`);
        
        // バックエンドのセッションチェックAPIを呼び出し
        const response = await fetch(`${backendUrl}/api/session/check`, {
            headers: {
                'Cookie': cookies || '', // 全てのCookieを転送
            },
            credentials: 'include',
        });
        
        console.log(`[${new Date().toISOString()}] APIレスポンスステータス: ${response.status}`);
        
        // レスポンスが正常でない場合はエラーをスロー
        if (!response.ok) {
            throw new Error(`セッションチェックに失敗しました: ${response.status}`);
        }
        
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
