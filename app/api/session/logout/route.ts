// app/api/session/logout/route.ts

import {NextRequest, NextResponse} from "next/server";
import {handleApiError} from '@/app/lib/api-utils';
import {UnauthorizedError} from '@/app/lib/errors';

/**
 * POSTリクエストを処理し、ユーザーをログアウトさせるエンドポイント。
 *
 * @param request - クライアントからのHTTPリクエストオブジェクト
 * @returns レスポンスオブジェクト
 * @throws {UnauthorizedError} sessionIdが見つからない場合
 * @throws {Error} ログアウトに失敗した場合
 */
export async function POST(request: NextRequest): Promise<Response> {
    console.log(`[${new Date().toISOString()}] POST リクエスト開始: /api/session/logout`);
    try {
        // バックエンドのURLを環境変数から取得、デフォルトはローカルホスト
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        
        // リクエストヘッダーからCookieを取得
        const cookies = request.headers.get('cookie') || '';
        
        // sessionIdをCookieから抽出
        const sessionId = cookies.split('; ').find(row => row.startsWith('sessionId'))?.split('=')[1];
        if (!sessionId) {
            throw new UnauthorizedError('sessionIdが見つかりません');
        }
        
        console.log(`[${new Date().toISOString()}] バックエンドAPIリクエスト開始: ${backendUrl}/api/session/logout`);
        
        // バックエンドにログアウトリクエストを送信
        const response = await fetch(`${backendUrl}/api/session/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `sessionId=${sessionId}`, // sessionIdのみをヘッダーにセット
            },
        });
        
        console.log(`[${new Date().toISOString()}] バックエンドAPIレスポンス受信: ステータス=${response.status}`);
        
        if (!response.ok) {
            throw new Error(`ログアウトに失敗しました: ${response.status}`);
        }
        
        // レスポンスを作成し、sessionId Cookieを削除
        const nextResponse = NextResponse.json(null, {
            status: response.status,
        });
        
        nextResponse.cookies.set({
            name: 'sessionId',
            value: '',
            path: '/',
            maxAge: 0,
        });
        
        console.log(`[${new Date().toISOString()}] sessionId Cookieを削除しました`);
        
        return nextResponse;
    } catch (error) {
        // エラーハンドリング
        return handleApiError(error);
    } finally {
        console.log(`[${new Date().toISOString()}] POST リクエスト終了: /api/session/logout`);
    }
}
