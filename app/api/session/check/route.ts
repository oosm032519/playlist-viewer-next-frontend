// app/api/session/check/route.ts

import {NextRequest, NextResponse} from 'next/server';

/**
 * セッションの状態をチェックするためのGETリクエストを処理します。
 *
 * @param {NextRequest} request - クライアントからのリクエストオブジェクト
 * @returns {Promise<NextResponse>} - セッションの状態を含むレスポンスオブジェクト
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
    console.log(`[${new Date().toISOString()}] GET /api/session/check - リクエスト開始`);
    
    try {
        // 環境変数からバックエンドのURLを取得
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
        console.log(`[${new Date().toISOString()}] 環境変数からバックエンドURLを取得: ${backendUrl}`);
        
        // クッキーをリクエストヘッダーから取得
        const cookie = request.headers.get('Cookie') || '';
        console.log(`[${new Date().toISOString()}] リクエストヘッダーからクッキーを取得: ${cookie}`);
        
        // セッションチェックのためのAPIリクエストを送信
        console.log(`[${new Date().toISOString()}] セッションチェックのためのAPIリクエストを送信: ${backendUrl}/api/session/check`);
        const response = await fetch(`${backendUrl}/api/session/check`, {
            headers: {
                'Cookie': cookie,
            },
            credentials: 'include',
        });
        
        // APIレスポンスのステータスコードをログ出力
        console.log(`[${new Date().toISOString()}] APIレスポンスステータス: ${response.status}`);
        
        // APIレスポンスをJSON形式で取得
        const data = await response.json();
        console.log(`[${new Date().toISOString()}] APIレスポンスデータを取得: ${JSON.stringify(data)}`);
        
        // セッションの状態を含むレスポンスを返す
        console.log(`[${new Date().toISOString()}] セッションの状態を含むレスポンスを返す`);
        return NextResponse.json(data);
    } catch (error) {
        // エラーログをコンソールに出力
        console.error(`[${new Date().toISOString()}] セッションチェックエラー:`, error);
        
        // エラーレスポンスを返す
        console.log(`[${new Date().toISOString()}] エラーレスポンスを返す`);
        return NextResponse.json({status: 'error', message: 'セッションチェックに失敗しました'}, {status: 500});
    } finally {
        console.log(`[${new Date().toISOString()}] GET /api/session/check - リクエスト終了`);
    }
}
