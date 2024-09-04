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
    console.log('getFavoritePlaylists関数が呼び出されました');
    
    try {
        // Cookieを取得
        const cookies = getCookies(req);
        
        // APIリクエストを実行
        const response = await sendRequest('/api/playlists/favorites', 'GET', undefined, cookies);
        
        const data = await response.json();
        
        console.log('APIレスポンスを受信しました:', response.status);
        console.log('レスポンスデータ:', data);
        
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
    console.log('GETハンドラーが呼び出されました');
    
    return getFavoritePlaylists(req);
});
