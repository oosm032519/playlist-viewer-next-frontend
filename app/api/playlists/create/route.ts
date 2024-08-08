// app/api/playlists/create/route.ts

import {NextRequest} from "next/server";

/**
 * プレイリスト作成のためのPOSTメソッドを処理する非同期関数
 * @param {NextRequest} request - クライアントからのリクエスト
 * @returns {Promise<Response>} - 作成されたプレイリストのレスポンス
 */
export async function POST(request: NextRequest): Promise<Response> {
    try {
        // リクエストボディからトラックIDの配列を取得
        const trackIds: string[] = await request.json();
        
        // バックエンドAPIのエンドポイントURLを環境変数から取得、デフォルトはローカルホスト
        const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
        
        // バックエンドAPIに対してプレイリスト作成リクエストを送信
        const response = await fetch(`${backendUrl}/api/playlists/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(trackIds),
            credentials: 'include', // Cookieを含める
        });
        
        // レスポンスが正常でない場合はエラーをスロー
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // レスポンスボディをJSONとしてパース
        const data = await response.json();
        
        // 成功したレスポンスを返す
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        // エラーハンドリング
        if (error instanceof Error) {
            console.error("Error creating playlist:", error.message);
            return new Response(
                JSON.stringify({error: "Failed to create playlist", details: error.message}),
                {status: 500, headers: {'Content-Type': 'application/json'}}
            );
        } else {
            console.error("Unknown error:", error);
            return new Response(
                JSON.stringify({error: "Failed to create playlist", details: "Unknown error"}),
                {status: 500, headers: {'Content-Type': 'application/json'}}
            );
        }
    }
}
