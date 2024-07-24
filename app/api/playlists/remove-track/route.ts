// app/api/playlists/remove-track/route.ts

import {NextRequest} from "next/server";

/**
 * POSTリクエストを処理し、プレイリストからトラックを削除します。
 *
 * @param {NextRequest} request - クライアントからのリクエストオブジェクト
 * @returns {Promise<Response>} - 処理結果のレスポンスオブジェクト
 */
export async function POST(request: NextRequest): Promise<Response> {
    console.log("POST request received to remove track from playlist");
    try {
        // リクエストボディからプレイリストIDとトラックIDを取得
        const {playlistId, trackId} = await request.json();
        console.log(`Received request to remove track ${trackId} from playlist ${playlistId}`);
        
        // バックエンドのURLを環境変数から取得（デフォルトはローカルホスト）
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        console.log(`Using backend URL: ${backendUrl}`);
        
        // バックエンドAPIに対してトラック削除リクエストを送信
        const response = await fetch(`${backendUrl}/api/playlist/remove-track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': request.headers.get('cookie') || '',
            },
            body: JSON.stringify({playlistId, trackId}),
            credentials: 'include',
        });
        
        // バックエンドからのレスポンスデータを取得
        const responseData = await response.json();
        
        // レスポンスが成功した場合
        if (response.ok) {
            return new Response(JSON.stringify(responseData), {
                status: response.status,
                headers: {'Content-Type': 'application/json'}
            });
        }
        
        // エラーレスポンスの場合
        throw new Error(JSON.stringify(responseData));
    } catch (error) {
        console.error("Error removing track from playlist:", error);
        let errorMessage = "Failed to remove track from playlist";
        let errorDetails = "Unknown error";
        let statusCode = 500;
        
        if (error instanceof Error) {
            try {
                errorDetails = JSON.parse(error.message);
            } catch {
                errorDetails = error.message;
            }
        }
        
        // エラーレスポンスを返す
        return new Response(
            JSON.stringify({error: errorMessage, details: errorDetails}),
            {status: statusCode, headers: {'Content-Type': 'application/json'}}
        );
    }
}
