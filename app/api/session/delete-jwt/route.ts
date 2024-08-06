// app/api/session/delete-jwt/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {kv} from '@vercel/kv';

const SESSION_COOKIE_NAME = 'session_id';

function createResponse(body: any, status: number = 200): NextResponse {
    const response = NextResponse.json(body, {status});
    
    // キャッシュ制御ヘッダーを設定
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
    console.log(`[${new Date().toISOString()}] DELETE リクエスト開始: /api/session/delete-jwt`);
    
    try {
        const sessionId = request.cookies.get(SESSION_COOKIE_NAME)?.value;
        
        if (!sessionId) {
            console.log(`[${new Date().toISOString()}] セッションIDが見つかりません`);
            return createResponse({error: "セッションIDが見つかりません"}, 401);
        }
        
        console.log(`[${new Date().toISOString()}] Vercel KVからJWTトークンを削除開始: ${sessionId}`);
        const deleteResult = await kv.del(`session:${sessionId}`);
        console.log(`[${new Date().toISOString()}] 削除結果:`, deleteResult);
        
        if (deleteResult !== 1) {
            console.log(`[${new Date().toISOString()}] JWTトークンの削除に失敗しました`);
            return createResponse({error: "JWTトークンの削除に失敗しました"}, 500);
        }
        
        console.log(`[${new Date().toISOString()}] JWTトークンを正常に削除しました`);
        
        const response = createResponse({success: true});
        response.cookies.delete(SESSION_COOKIE_NAME);
        console.log(`[${new Date().toISOString()}] Cookieを削除しました`);
        
        return response;
    } catch (error) {
        console.error(`[${new Date().toISOString()}] エラー発生:`, error);
        return createResponse({error: "JWTの削除に失敗しました"}, 500);
    } finally {
        console.log(`[${new Date().toISOString()}] DELETE リクエスト終了: /api/session/delete-jwt`);
    }
}
