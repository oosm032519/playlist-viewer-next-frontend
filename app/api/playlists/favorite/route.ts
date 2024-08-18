// app/api/playlists/favorite/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {handleApiError} from '@/app/lib/api-utils';
import {UnauthorizedError, BadRequestError} from '@/app/lib/errors';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

/**
 * お気に入りプレイリストを処理する非同期関数
 *
 * @param req - クライアントからのリクエストオブジェクト
 * @param method - HTTPメソッド ('POST' または 'DELETE')
 * @returns APIからのレスポンスデータ
 * @throws {UnauthorizedError} 認証に失敗した場合
 * @throws {BadRequestError} リクエストが不正な場合
 */
const handleFavoritePlaylist = async (req: NextRequest, method: 'POST' | 'DELETE'): Promise<Response> => {
    console.log(`handle${method}FavoritePlaylist関数が呼び出されました`);
    
    const apiUrl = `${backendUrl}/api/playlists/favorite`;
    
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
        
        // リクエストボディを解析
        const body = await req.json();
        console.log('リクエストボディ:', body);  // ボディの内容をログ出力
        
        // URLSearchParamsを使用してクエリパラメータを構築
        const params = new URLSearchParams({
            playlistId: body.playlistId,
            playlistName: body.playlistName,
            totalTracks: body.totalTracks.toString(),
            playlistOwnerName: body.playlistOwnerName
        });
        
        const fullUrl = `${apiUrl}?${params.toString()}`;
        console.log('完全なURL:', fullUrl);
        
        // APIリクエストを実行
        const response = await fetch(fullUrl, {
            method: method,
            headers: {
                'Cookie': `sessionId=${sessionId}`, // sessionIdのみをヘッダーにセット
            },
            credentials: 'include', // クレデンシャルを含める
        });
        
        // レスポンスが成功でない場合のエラーハンドリング
        if (!response.ok) {
            return handleApiError(new Error(`お気に入りプレイリストの${method === 'POST' ? '追加' : '削除'}に失敗しました: ${response.status}`));
        }
        
        const data = await response.json();
        
        console.log('APIレスポンスを受信しました:', response.status);
        console.log('レスポンスデータ:', data);
        
        return NextResponse.json(data);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * お気に入りプレイリストを追加するためのPOSTハンドラー
 *
 * @param req - クライアントからのリクエストオブジェクト
 * @returns APIからのレスポンスデータを含むNextResponseオブジェクト
 */
export async function POST(req: NextRequest): Promise<Response> {
    console.log('POSTハンドラーが呼び出されました');
    
    return handleFavoritePlaylist(req, 'POST');
}

/**
 * お気に入りプレイリストを削除するためのDELETEハンドラー
 *
 * @param req - クライアントからのリクエストオブジェクト
 * @returns APIからのレスポンスデータを含むNextResponseオブジェクト
 */
export async function DELETE(req: NextRequest): Promise<Response> {
    console.log('DELETEハンドラーが呼び出されました');
    
    return handleFavoritePlaylist(req, 'DELETE');
}
