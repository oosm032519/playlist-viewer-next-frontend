// app/api/playlists/add-track/route.ts

import {NextRequest} from "next/server";

/**
 * POSTリクエストを処理する非同期関数
 * @param {NextRequest} request - クライアントからのリクエストオブジェクト
 * @returns {Promise<Response>} - バックエンドからのレスポンスをクライアントに返す
 */
export async function POST(request: NextRequest): Promise<Response> {
    try {
        // リクエストのJSONボディからplaylistIdとtrackIdを抽出
        const {playlistId, trackId} = await request.json();
        
        // バックエンドAPIのエンドポイントURLを環境変数から取得、デフォルトはローカルホスト
        const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
        
        // バックエンドAPIにトラックをプレイリストに追加するためのリクエストを送信
        const response = await fetch(`${backendUrl}/api/playlist/add-track`, {
            method: 'POST', // HTTPメソッドをPOSTに設定
            credentials: 'include', // 認証情報を含める
            headers: {
                'Content-Type': 'application/json', // リクエストのコンテンツタイプをJSONに設定
                'Cookie': request.headers.get('cookie') || '', // クッキーをヘッダーに追加
            },
            body: JSON.stringify({playlistId, trackId}), // リクエストボディにplaylistIdとtrackIdをJSON形式で追加
        });
        
        // バックエンドからのレスポンスをJSON形式で取得
        const data = await response.json();
        
        // クライアントにレスポンスを返す
        return new Response(JSON.stringify(data), {
            status: response.status, // バックエンドからのステータスコードをそのまま使用
            headers: {'Content-Type': 'application/json'}, // レスポンスのコンテンツタイプをJSONに設定
        });
    } catch (error) {
        // エラーハンドリング
        if (error instanceof Error) {
            // エラーがErrorオブジェクトの場合、エラーメッセージをログに出力し、500エラーを返す
            console.error("Error adding track to playlist:", error.message);
            return new Response(
                JSON.stringify({error: "Failed to add track to playlist", details: error.message}),
                {status: 500, headers: {'Content-Type': 'application/json'}}
            );
        } else {
            // 不明なエラーの場合、500エラーを返す
            console.error("Unknown error:", error);
            return new Response(
                JSON.stringify({error: "Failed to add track to playlist", details: "Unknown error"}),
                {status: 500, headers: {'Content-Type': 'application/json'}}
            );
        }
    }
}
