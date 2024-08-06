import {NextRequest, NextResponse} from 'next/server';
import {kv} from '@vercel/kv';

export async function GET(request: NextRequest): Promise<NextResponse> {
    console.log(`[${new Date().toISOString()}] GET リクエスト開始: /api/auth/get-jwt`);
    
    try {
        // セッションIDを取得
        const sessionId = request.cookies.get('session_id')?.value;
        if (!sessionId) {
            console.log(`[${new Date().toISOString()}] セッションIDが見つかりません`);
            return NextResponse.json({error: "セッションIDが見つかりません"}, {status: 401});
        }
        
        // Vercel KVからJWTトークンを取得
        const jwt = await kv.get(`session:${sessionId}`);
        if (!jwt) {
            console.log(`[${new Date().toISOString()}] JWTが見つかりません`);
            return NextResponse.json({error: "JWTが見つかりません"}, {status: 401});
        }
        
        console.log(`[${new Date().toISOString()}] JWTトークンを取得しました`);
        return NextResponse.json({jwt});
    } catch (error) {
        console.error(`[${new Date().toISOString()}] エラー発生:`, error);
        return NextResponse.json({error: "JWTの取得に失敗しました"}, {status: 500});
    } finally {
        console.log(`[${new Date().toISOString()}] GET リクエスト終了: /api/auth/get-jwt`);
    }
}
