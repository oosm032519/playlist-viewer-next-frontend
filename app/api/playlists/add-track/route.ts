// app/api/playlists/add-track/route.ts

import {NextRequest} from "next/server";
import {cookies} from 'next/headers';

/**
 * POSTリクエストを処理する非同期関数
 * @param {NextRequest} request - クライアントからのリクエストオブジェクト
 * @returns {Promise<Response>} - バックエンドからのレスポンスをクライアントに返す
 */
export async function POST(request: NextRequest): Promise<Response> {
    console.log(`[${new Date().toISOString()}] POST リクエスト開始: /api/playlists/add-track`);
    try {
        // リクエストのJSONボディからplaylistIdとtrackIdを抽出
        const {playlistId, trackId} = await request.json();
        console.log(`[${new Date().toISOString()}] リクエストボディ解析完了: playlistId=${playlistId}, trackId=${trackId}`);
        
        // バックエンドAPIのエンドポイントURLを環境変数から取得、デフォルトはローカルホスト
        const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
        console.log(`[${new Date().toISOString()}] バックエンドURL: ${backendUrl}`);
        
        // JWTクッキーを取得
        const cookieStore = cookies();
        const jwt = cookieStore.get('JWT')?.value;
        console.log(`[${new Date().toISOString()}] JWTクッキーを取得: ${jwt}`);
        
        // バックエンドAPIにトラックをプレイリストに追加するためのリクエストを送信
        console.log(`[${new Date().toISOString()}] バックエンドAPIリクエスト開始: ${backendUrl}/api/playlist/add-track`);
        const response = await fetch(`${backendUrl}/api/playlist/add-track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `JWT=${jwt}`, // JWTクッキーのみを送信
            },
            body: JSON.stringify({playlistId, trackId}),
        });
        console.log(`[${new Date().toISOString()}] バックエンドAPIレスポンス受信: ステータス=${response.status}`);
        
        // バックエンドからのレスポンスをJSON形式で取得
        const data = await response.json();
        console.log(`[${new Date().toISOString()}] バックエンドAPIレスポンス内容:`, JSON.stringify(data));
        
        // クライアントにレスポンスを返す
        console.log(`[${new Date().toISOString()}] クライアントへのレスポンス送信: ステータス=${response.status}`);
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        // エラーハンドリング
        console.error(`[${new Date().toISOString()}] エラー発生:`, error);
        if (error instanceof Error) {
            console.error(`[${new Date().toISOString()}] エラー詳細: ${error.message}`);
            console.error(`[${new Date().toISOString()}] スタックトレース:`, error.stack);
            return new Response(
                JSON.stringify({error: "プレイリストへのトラック追加に失敗しました", details: error.message}),
                {status: 500, headers: {'Content-Type': 'application/json'}}
            );
        } else {
            console.error(`[${new Date().toISOString()}] 不明なエラー:`, error);
            return new Response(
                JSON.stringify({error: "プレイリストへのトラック追加に失敗しました", details: "不明なエラー"}),
                {status: 500, headers: {'Content-Type': 'application/json'}}
            );
        }
    } finally {
        console.log(`[${new Date().toISOString()}] POST リクエスト終了: /api/playlists/add-track`);
    }
}
