// app/api/session/get-jwt/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {kv} from '@vercel/kv';

export async function GET(request: NextRequest): Promise<NextResponse> {
    console.log(`[${new Date().toISOString()}] GET リクエスト開始: /api/session/get-jwt`);
    
    try {
        // セッションIDを取得
        const sessionId = request.cookies.get('session_id')?.value;
        if (!sessionId) {
            console.log(`[${new Date().toISOString()}] セッションIDが見つかりません`);
            return createResponse({error: "セッションIDが見つかりません"}, 401);
        }
        
        // Vercel KVからJWTトークンを取得
        const jwt = await kv.get(`session:${sessionId}`);
        if (!jwt) {
            console.log(`[${new Date().toISOString()}] JWTが見つかりません`);
            return createResponse({error: "JWTが見つかりません"}, 401);
        }
        
        console.log(`[${new Date().toISOString()}] JWTトークンを取得しました`);
        return createResponse({jwt});
    } catch (error) {
        console.error(`[${new Date().toISOString()}] エラー発生:`, error);
        return createResponse({error: "JWTの取得に失敗しました"}, 500);
    } finally {
        console.log(`[${new Date().toISOString()}] GET リクエスト終了: /api/session/get-jwt`);
    }
}

function createResponse(body: any, status: number = 200): NextResponse {
    const response = NextResponse.json(body, {status});
    
    // キャッシュ制御ヘッダーを設定
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;
}
