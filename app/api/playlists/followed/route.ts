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
const getFollowedPlaylists = async (req: NextRequest): Promise<any> => {
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
        
        if (!response.ok) {
            // レスポンスが成功でない場合、ステータスに応じたエラーをスロー
            if (response.status === 401) {
                throw new UnauthorizedError('認証されていません');
            } else {
                const errorText = await response.text();
                throw new Error(`プレイリストの取得に失敗しました: ${errorText}`);
            }
        }
        
        // レスポンスデータをJSONとしてパース
        const data = await response.json();
        
        console.log('APIレスポンスを受信しました:', response.status);
        console.log('レスポンスデータ:', data);
        
        return data;
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
export async function GET(req: NextRequest): Promise<NextResponse> {
    console.log('GETハンドラーが呼び出されました');
    
    try {
        // フォロー中のプレイリストを取得
        const playlists = await getFollowedPlaylists(req);
        console.log('プレイリストの取得に成功しました:', playlists);
        
        // プレイリストデータをJSONレスポンスとして返す
        return NextResponse.json(playlists);
    } catch (error) {
        // エラーをハンドルするユーティリティ関数を使用
        return handleApiError(error);
    }
}
