// app/api/session/sessionId/route.ts

import {NextResponse} from 'next/server';
import {handleApiError, sendRequest} from '@/app/lib/api-utils';
import {BadRequestError} from '@/app/lib/errors';

/**
 * セッションIDを取得するためのPOSTリクエストを処理します。
 *
 * @param request - クライアントからのリクエストオブジェクト
 * @returns セッションIDを含むレスポンスまたはエラーレスポンス
 *
 * @throws BadRequestError - 一時トークンが提供されていない場合
 * @throws Error - セッションIDの取得に失敗した場合
 */
export async function POST(request: Request) {
    // リクエストボディからtemporaryTokenを取得
    const {temporaryToken} = await request.json();
    
    // 一時トークンが存在しない場合はエラーを返す
    if (!temporaryToken) {
        return handleApiError(new BadRequestError('一時トークンが提供されていません'));
    }
    
    try {
        // バックエンドAPIにPOSTリクエストを送信
        const response = await sendRequest('/api/session/sessionId', 'POST', {temporaryToken});
        
        // 成功した場合、レスポンスデータを取得
        const data = await response.json();
        
        // NextResponse.jsonで新しいレスポンスを作成
        const newResponse = NextResponse.json(data, {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        });
        
        // HttpOnlyフラグ付きでクッキーを設定
        newResponse.cookies.set('sessionId', data.sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1週間
        });
        
        return newResponse;
    } catch (error) {
        // エラーが発生した場合はエラーハンドリングを行う
        return handleApiError(error);
    }
}
