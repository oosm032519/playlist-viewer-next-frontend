// app/api/playlists/followed/route.ts

import {NextRequest} from 'next/server';
import {withAuth} from '@/app/middleware/auth';
import {getCookies, handleApiError, sendRequest} from '@/app/lib/api-utils';

/**
 * フォロー中のプレイリストを取得する非同期関数
 * @param {NextRequest} req - Next.jsのリクエストオブジェクト
 * @returns {Promise<any>} フォロー中のプレイリストデータ
 */
const getFollowedPlaylists = async (req: NextRequest): Promise<Response> => {
    try {
        // Cookieを取得
        const cookies = getCookies(req);
        
        // APIにGETリクエストを送信
        const response = await sendRequest('/api/playlists/followed', 'GET', undefined, cookies);
        
        // レスポンスデータをJSONとしてパース
        const data = await response.json();
        
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        // エラーをハンドルするユーティリティ関数を使用
        return handleApiError(error);
    }
};

/**
 * GETリクエストを処理するハンドラー関数
 * @param {NextRequest} req - Next.jsのリクエストオブジェクト
 * @returns {Promise<NextResponse>} フォロー中のプレイリストデータを含むレスポンス
 */
export const GET = withAuth(async (req: NextRequest): Promise<Response> => {
    return getFollowedPlaylists(req);
});
