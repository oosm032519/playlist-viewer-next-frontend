// app/api/playlists/followed/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {handleApiError} from '@/app/lib/api-utils';
import {UnauthorizedError} from '@/app/lib/errors';

/**
 * フォロー中のプレイリストを取得する非同期関数
 * @param {NextRequest} req - Next.jsのリクエストオブジェクト
 * @returns {Promise<any>} フォロー中のプレイリストデータ
 * @throws {UnauthorizedError} 認証エラーが発生した場合
 * @throws {Error} APIリクエストが失敗した場合にエラーをスロー
 */
const getFollowedPlaylists = async (req: NextRequest): Promise<Response> => {
    console.log('getFollowedPlaylists関数が呼び出されました');
    
    // バックエンドのURLを環境変数から取得
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    const apiUrl = `${backendUrl}/api/playlists/followed`;
    
    try {
        console.log('APIリクエストを送信します:', apiUrl);
        
        // リクエストからCookieを取得
        const cookie = req.headers.get('Cookie');
        console.log('Cookie:', cookie);
        
        if (!cookie) {
            // Cookieが存在しない場合は認証エラーをスロー
            throw new UnauthorizedError('Cookieが見つかりません');
        }
        
        // sessionIdをCookieから抽出
        const sessionId = cookie.split('; ').find(row => row.startsWith('sessionId'))?.split('=')[1];
        if (!sessionId) {
            // sessionIdが存在しない場合は認証エラーをスロー
            throw new UnauthorizedError('sessionIdが見つかりません');
        }
        
        // APIにGETリクエストを送信
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Cookie': `sessionId=${sessionId}`, // sessionIdのみをヘッダーにセット
            },
            credentials: 'include', // クレデンシャルを含める
        });
        
        // レスポンスが成功でない場合のエラーハンドリング
        if (!response.ok) {
            return handleApiError(new Error(`プレイリストの取得に失敗しました: ${response.status}`));
        }
        
        // レスポンスデータをJSONとしてパース
        const data = await response.json();
        
        console.log('APIレスポンスを受信しました:', response.status);
        console.log('レスポンスデータ:', data);
        
        return NextResponse.json(data);
    } catch (error) {
        // エラーをハンドルするユーティリティ関数を使用
        return handleApiError(error);
    }
};

/**
 * GETリクエストを処理するハンドラー関数
 * @param {NextRequest} req - Next.jsのリクエストオブジェクト
 * @returns {Promise<NextResponse>} フォロー中のプレイリストデータを含むレスポンス
 * @throws {Error} APIリクエストが失敗した場合にエラーをスロー
 */
export async function GET(req: NextRequest): Promise<Response> {
    console.log('GETハンドラーが呼び出されました');
    
    return getFollowedPlaylists(req);
}
