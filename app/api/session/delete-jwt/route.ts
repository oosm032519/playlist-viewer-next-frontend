import {NextRequest, NextResponse} from 'next/server';
import {kv} from '@vercel/kv';

const SESSION_COOKIE_NAME = 'session_id';

export async function DELETE(request: NextRequest): Promise<NextResponse> {
    console.log(`[${new Date().toISOString()}] DELETE リクエスト開始: /api/session/delete-jwt`);
    
    try {
        const sessionId = request.cookies.get(SESSION_COOKIE_NAME)?.value;
        
        if (!sessionId) {
            console.log(`[${new Date().toISOString()}] セッションIDが見つかりません`);
            return NextResponse.json({error: "セッションIDが見つかりません"}, {status: 401});
        }
        
        console.log(`[${new Date().toISOString()}] Vercel KVからJWTトークンを削除開始: ${sessionId}`);
        const deleteResult = await kv.del(`session:${sessionId}`);
        console.log(`[${new Date().toISOString()}] 削除結果:`, deleteResult);
        
        if (deleteResult !== 1) {
            console.log(`[${new Date().toISOString()}] JWTトークンの削除に失敗しました`);
            return NextResponse.json({error: "JWTトークンの削除に失敗しました"}, {status: 500});
        }
        
        console.log(`[${new Date().toISOString()}] JWTトークンを正常に削除しました`);
        
        const response = NextResponse.json({success: true});
        response.cookies.delete(SESSION_COOKIE_NAME);
        console.log(`[${new Date().toISOString()}] Cookieを削除しました`);
        
        return response;
    } catch (error) {
        console.error(`[${new Date().toISOString()}] エラー発生:`, error);
        return NextResponse.json({error: "JWTの削除に失敗しました"}, {status: 500});
    } finally {
        console.log(`[${new Date().toISOString()}] DELETE リクエスト終了: /api/session/delete-jwt`);
    }
}
