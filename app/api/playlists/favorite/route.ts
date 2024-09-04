// app/api/playlists/favorite/route.ts

import {NextRequest} from 'next/server';
import {withAuth} from '@/app/middleware/auth';
import {getCookies, handleApiError, sendRequest} from '@/app/lib/api-utils';

/**
 * お気に入りプレイリストを処理する非同期関数
 *
 * @param req - クライアントからのリクエストオブジェクト
 * @param method - HTTPメソッド ('POST' または 'DELETE')
 * @returns APIからのレスポンスデータ
 */
const handleFavoritePlaylist = async (req: NextRequest, method: 'POST' | 'DELETE'): Promise<Response> => {
    console.log(`handle${method}FavoritePlaylist関数が呼び出されました`);
    
    try {
        // Cookieを取得
        const cookies = getCookies(req);
        
        // リクエストボディを解析
        const body = await req.json();
        console.log('リクエストボディ:', body);
        
        // URLSearchParamsを使用してクエリパラメータを構築
        const params = new URLSearchParams({
            playlistId: body.playlistId,
            playlistName: body.playlistName,
            totalTracks: body.totalTracks.toString(),
            playlistOwnerName: body.playlistOwnerName
        });
        
        const fullUrl = `/api/playlists/favorite?${params.toString()}`;
        console.log('完全なURL:', fullUrl);
        
        // APIリクエストを実行
        const response = await sendRequest(fullUrl, method, undefined, cookies);
        
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
 * お気に入りプレイリストを追加するためのPOSTハンドラー
 *
 * @param req - クライアントからのリクエストオブジェクト
 * @returns APIからのレスポンスデータを含むNextResponseオブジェクト
 */
export const POST = withAuth(async (req: NextRequest): Promise<Response> => {
    console.log('POSTハンドラーが呼び出されました');
    
    return handleFavoritePlaylist(req, 'POST');
});

/**
 * お気に入りプレイリストを削除するためのDELETEハンドラー
 *
 * @param req - クライアントからのリクエストオブジェクト
 * @returns APIからのレスポンスデータを含むNextResponseオブジェクト
 */
export const DELETE = withAuth(async (req: NextRequest): Promise<Response> => {
    console.log('DELETEハンドラーが呼び出されました');
    
    return handleFavoritePlaylist(req, 'DELETE');
});
