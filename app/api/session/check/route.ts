// app/api/session/check/route.ts

import {NextRequest, NextResponse} from 'next/server';

/**
 * セッションの状態をチェックするためのGETリクエストを処理します。
 *
 * @param {NextRequest} request - クライアントからのリクエストオブジェクト
 * @returns {Promise<NextResponse>} - セッションの状態を含むレスポンスオブジェクト
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        // 環境変数からバックエンドのURLを取得
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
        
        // クッキーをリクエストヘッダーから取得
        const cookie = request.headers.get('Cookie') || '';
        
        // セッションチェックのためのAPIリクエストを送信
        const response = await fetch(`${backendUrl}/api/session/check`, {
            headers: {
                'Cookie': cookie,
            },
            credentials: 'include',
        });
        
        // APIレスポンスをJSON形式で取得
        const data = await response.json();
        
        // セッションの状態を含むレスポンスを返す
        return NextResponse.json(data);
    } catch (error) {
        // エラーログをコンソールに出力
        console.error('セッションチェックエラー:', error);
        
        // エラーレスポンスを返す
        return NextResponse.json({status: 'error', message: 'セッションチェックに失敗しました'}, {status: 500});
    }
}
