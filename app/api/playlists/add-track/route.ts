// app/api/playlists/add-track/route.ts

import {NextRequest} from "next/server";
import {handleApiError} from '@/app/lib/api-utils';
import {NotFoundError, UnauthorizedError} from '@/app/lib/errors';

/**
 * プレイリストにトラックを追加するためのAPIエンドポイント。
 *
 * @param request - クライアントからのHTTPリクエスト
 * @returns プレイリストにトラックを追加した結果を含むHTTPレスポンス
 *
 * @throws {NotFoundError} プレイリストが見つからない場合
 * @throws {UnauthorizedError} 認証されていない場合
 * @throws {Error} その他のエラーが発生した場合
 */
export async function POST(request: NextRequest): Promise<Response> {
    console.log(`[${new Date().toISOString()}] POST リクエスト開始: /api/playlists/add-track`);
    try {
        // リクエストボディからplaylistIdとtrackIdを取得
        const {playlistId, trackId} = await request.json();
        console.log(`[${new Date().toISOString()}] リクエストボディ解析完了: playlistId=${playlistId}, trackId=${trackId}`);
        
        // バックエンドのURLを環境変数から取得
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        console.log(`[${new Date().toISOString()}] バックエンドURL: ${backendUrl}`);
        
        // リクエストヘッダーからクッキーを取得
        const cookies = request.headers.get('cookie') || '';
        
        // バックエンドAPIにPOSTリクエストを送信
        console.log(`[${new Date().toISOString()}] バックエンドAPIリクエスト開始: ${backendUrl}/api/playlist/add-track`);
        const response = await fetch(`${backendUrl}/api/playlist/add-track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies,
            },
            body: JSON.stringify({playlistId, trackId}),
        });
        console.log(`[${new Date().toISOString()}] バックエンドAPIレスポンス受信: ステータス=${response.status}`);
        
        // レスポンスが成功でない場合のエラーハンドリング
        if (!response.ok) {
            if (response.status === 404) {
                throw new NotFoundError('プレイリストが見つかりません');
            } else if (response.status === 401) {
                throw new UnauthorizedError('認証されていません');
            } else {
                const errorData = await response.json();
                throw new Error(`プレイリストへのトラック追加に失敗しました: ${errorData.details || '不明なエラー'}`);
            }
        }
        
        // 成功した場合のレスポンスデータを取得
        const data = await response.json();
        console.log(`[${new Date().toISOString()}] バックエンドAPIレスポンス内容:`, JSON.stringify(data));
        
        // クライアントへのレスポンスを送信
        console.log(`[${new Date().toISOString()}] クライアントへのレスポンス送信: ステータス=${response.status}`);
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        // エラーハンドリング
        return handleApiError(error);
    } finally {
        console.log(`[${new Date().toISOString()}] POST リクエスト終了: /api/playlists/add-track`);
    }
}
