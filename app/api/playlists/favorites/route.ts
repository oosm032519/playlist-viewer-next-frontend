// app/api/playlists/favorites/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {handleApiError} from '@/app/lib/api-utils';
import {UnauthorizedError} from '@/app/lib/errors';

/**
 * お気に入りプレイリストを取得する非同期関数
 *
 * @param req - Next.jsのリクエストオブジェクト
 * @returns お気に入りプレイリストのデータ
 * @throws {UnauthorizedError} クッキーまたはsessionIdが見つからない場合
 * @throws {Error} APIリクエストが失敗した場合
 */
const getFavoritePlaylists = async (req: NextRequest): Promise<any> => {
    console.log('getFavoritePlaylists関数が呼び出されました');
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    const apiUrl = `${backendUrl}/api/playlists/favorites`;
    
    try {
        console.log('APIリクエストを送信します:', apiUrl);
        
        // リクエストからCookieを取得
        const cookie = req.headers.get('Cookie');
        console.log('Cookie:', cookie);
        
        if (!cookie) {
            throw new UnauthorizedError('Cookieが見つかりません');
        }
        
        // sessionIdを抽出
        const sessionId = cookie.split('; ').find(row => row.startsWith('sessionId'))?.split('=')[1];
        if (!sessionId) {
            throw new UnauthorizedError('sessionIdが見つかりません');
        }
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Cookie': `sessionId=${sessionId}`, // sessionIdのみをヘッダーにセット
            },
            credentials: 'include', // クレデンシャルを含める
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new UnauthorizedError('認証されていません');
            } else {
                const errorText = await response.text();
                throw new Error(`お気に入りプレイリストの取得に失敗しました: ${errorText}`);
            }
        }
        
        const data = await response.json();
        
        console.log('APIレスポンスを受信しました:', response.status);
        console.log('レスポンスデータ:', data);
        
        return data;
    } catch (error) {
        return handleApiError(error);
    }
};

/**
 * JSONレスポンスを作成する関数
 *
 * @param body - レスポンスボディ
 * @param status - HTTPステータスコード（デフォルトは200）
 * @returns Next.jsのレスポンスオブジェクト
 */
function createResponse(body: any, status: number = 200): NextResponse {
    const response = NextResponse.json(body, {status});
    
    // キャッシュ制御ヘッダーを設定
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;
}

/**
 * GETリクエストを処理するハンドラー
 *
 * @param req - Next.jsのリクエストオブジェクト
 * @returns お気に入りプレイリストのレスポンス
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
    console.log('GETハンドラーが呼び出されました');
    
    try {
        const playlists = await getFavoritePlaylists(req);
        console.log('お気に入りプレイリストの取得に成功しました:', playlists);
        
        return createResponse(playlists);
    } catch (error) {
        return handleApiError(error);
    }
}
