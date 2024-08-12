// app/api/playlists/remove-track/route.ts

import {NextRequest} from "next/server";
import {handleApiError} from '@/app/lib/api-utils';
import {NotFoundError, UnauthorizedError} from '@/app/lib/errors';

/**
 * プレイリストからトラックを削除するためのAPIエンドポイント。
 *
 * @param {NextRequest} request - Next.jsのリクエストオブジェクト。JSONボディにplaylistIdとtrackIdを含む。
 * @returns {Promise<Response>} - 操作の結果を示すHTTPレスポンス。
 * @throws {UnauthorizedError} - Cookieが存在しない場合。
 * @throws {NotFoundError} - プレイリストが見つからない場合。
 * @throws {Error} - その他のエラーが発生した場合。
 */
export async function POST(request: NextRequest): Promise<Response> {
    console.log("POSTリクエストを受信しました: プレイリストからトラックを削除します");
    try {
        // リクエストボディからplaylistIdとtrackIdを取得
        const {playlistId, trackId} = await request.json();
        console.log(`トラック ${trackId} をプレイリスト ${playlistId} から削除するリクエストを受信しました`);
        
        // バックエンドのURLを環境変数から取得、デフォルトはローカルホスト
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        console.log(`使用するバックエンドURL: ${backendUrl}`);
        
        // リクエストからCookieを取得
        const cookie = request.headers.get('Cookie');
        console.log(`[${new Date().toISOString()}] Cookieを取得: ${cookie}`);
        
        // Cookieが存在しない場合は認証エラーをスロー
        if (!cookie) {
            throw new UnauthorizedError('Cookieが見つかりません');
        }
        
        // バックエンドにトラック削除リクエストを送信
        const response = await fetch(`${backendUrl}/api/playlist/remove-track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie, // CookieをそのままCookieヘッダーに設定
            },
            body: JSON.stringify({playlistId, trackId}),
            credentials: 'include', // クレデンシャルを含める
        });
        
        // レスポンスがOKかどうかを確認
        if (!response.ok) {
            if (response.status === 404) {
                throw new NotFoundError('プレイリストが見つかりません');
            } else if (response.status === 401) {
                throw new UnauthorizedError('認証されていません');
            } else {
                const errorData = await response.json();
                throw new Error(`トラックの削除に失敗しました: ${errorData.details || '不明なエラー'}`);
            }
        }
        
        // OKの場合は、レスポンスをJSONとして解析し、クライアントに返す
        const responseData = await response.json();
        return new Response(JSON.stringify(responseData), {
            status: response.status,
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        // エラーをハンドリングし、適切なレスポンスを返す
        return handleApiError(error);
    }
}
