// app/api/playlists/favorites/route.ts

import {NextRequest} from 'next/server';
import {withAuth} from '@/app/middleware/auth';
import {getCookies, handleApiError, sendRequest} from '@/app/lib/api-utils';

/**
 * お気に入りプレイリストを取得する非同期関数
 *
 * @param req - Next.jsのリクエストオブジェクト
 * @returns お気に入りプレイリストのデータ
 */
const getFavoritePlaylists = async (req: NextRequest): Promise<Response> => {
    try {
        // Cookieを取得
        const cookies = getCookies(req);
        
        // APIリクエストを実行
        const response = await sendRequest('/api/playlists/favorites', 'GET', undefined, cookies);
        
        const data = await response.json();
        
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        return handleApiError(error);
    }
};

/**
 * GETリクエストを処理するハンドラー
 *
 * @param req - Next.jsのリクエストオブジェクト
 * @returns お気に入りプレイリストのレスポンス
 */
export const GET = withAuth(async (req: NextRequest): Promise<Response> => {
    return getFavoritePlaylists(req);
});
