// app/api/session/check/route.ts

import {NextRequest, NextResponse} from 'next/server';

function createResponse(body: any, status: number = 200): NextResponse {
    const response = NextResponse.json(body, {status});
    
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    console.log(`[${new Date().toISOString()}] GET /api/session/check - リクエスト開始`);
    
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
        console.log(`[${new Date().toISOString()}] 環境変数からバックエンドURLを取得: ${backendUrl}`);
        
        const cookies = request.headers.get('cookie');
        console.log(`[${new Date().toISOString()}] 受け取ったCookie: ${cookies}`);
        
        const response = await fetch(`${backendUrl}/api/session/check`, {
            headers: {
                'Cookie': cookies || '', // 全てのCookieを転送
            },
            credentials: 'include',
        });
        
        console.log(`[${new Date().toISOString()}] APIレスポンスステータス: ${response.status}`);
        
        const data = await response.json();
        console.log(`[${new Date().toISOString()}] APIレスポンスデータを取得: ${JSON.stringify(data)}`);
        
        console.log(`[${new Date().toISOString()}] セッションの状態を含むレスポンスを返す`);
        return createResponse(data);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] セッションチェックエラー:`, error);
        
        console.log(`[${new Date().toISOString()}] エラーレスポンスを返す`);
        return createResponse({status: 'error', message: 'セッションチェックに失敗しました'}, 500);
    } finally {
        console.log(`[${new Date().toISOString()}] GET /api/session/check - リクエスト終了`);
    }
}
