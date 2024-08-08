// app/api/session/logout/route.ts

import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
    console.log(`[${new Date().toISOString()}] POST リクエスト開始: /api/session/logout`);
    try {
        // バックエンドのログアウトAPIにリクエストを転送
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        const cookies = request.headers.get('cookie') || '';
        
        console.log(`[${new Date().toISOString()}] バックエンドAPIリクエスト開始: ${backendUrl}/api/session/logout`);
        const response = await fetch(`${backendUrl}/api/session/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies,
            },
        });
        console.log(`[${new Date().toISOString()}] バックエンドAPIレスポンス受信: ステータス=${response.status}`);
        
        // バックエンドからのレスポンスをNextResponseに変換
        const nextResponse = NextResponse.json(null, {
            status: response.status,
        });
        
        // sessionId Cookieを削除
        nextResponse.cookies.set({
            name: 'sessionId',
            value: '',
            path: '/',
            maxAge: 0,
        });
        
        console.log(`[${new Date().toISOString()}] sessionId Cookieを削除しました`);
        
        return nextResponse;
    } catch (error) {
        console.error(`[${new Date().toISOString()}] エラー発生:`, error);
        return new Response(null, {status: 500});
    } finally {
        console.log(`[${new Date().toISOString()}] POST リクエスト終了: /api/session/logout`);
    }
}
