// app/api/session/logout/route.ts

import {NextRequest, NextResponse} from "next/server";
import {getCookies, handleApiError, sendRequest} from '@/app/lib/api-utils';
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
    try {
        // Cookieを取得
        const cookies = getCookies(request);
        
        // sessionIdをCookieから抽出
        const sessionId = cookies.split('; ').find(row => row.startsWith('sessionId'))?.split('=')[1];
        if (!sessionId) {
            throw new UnauthorizedError('sessionIdが見つかりません');
        }
        
        // バックエンドにログアウトリクエストを送信
        const response = await sendRequest('/api/session/logout', 'POST', undefined, cookies);
        
        // NextResponseを作成
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
        
        return nextResponse;
    } catch (error) {
        return handleApiError(error);
    }
}
