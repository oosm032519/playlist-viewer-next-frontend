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
const getFavoritePlaylists = async (req: NextRequest): Promise<Response> => {
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
        
        // レスポンスが成功でない場合のエラーハンドリング
        if (!response.ok) {
            return handleApiError(new Error(`お気に入りプレイリストの取得に失敗しました: ${response.status}`));
        }
        
        const data = await response.json();
        
        console.log('APIレスポンスを受信しました:', response.status);
        console.log('レスポンスデータ:', data);
        
        return NextResponse.json(data);
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
export async function GET(req: NextRequest): Promise<Response> {
    console.log('GETハンドラーが呼び出されました');
    
    return getFavoritePlaylists(req);
}
