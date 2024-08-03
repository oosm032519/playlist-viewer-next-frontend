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
        
        // リクエストヘッダーからJWTを取得
        const jwt = request.headers.get('Authorization')?.split(' ')[1]; // 'Bearer <token>'形式からトークン部分を抽出
        
        // JWTが存在しない場合はエラーを返す
        if (!jwt) {
            return new Response(JSON.stringify({error: 'Unauthorized'}), {status: 401});
        }
        
        // バックエンドAPIに対してプレイリスト作成リクエストを送信
        const response = await fetch(`${backendUrl}/api/playlists/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwt}`, // JWTをAuthorizationヘッダーに設定
                'Content-Type': 'application/json' // コンテンツタイプをJSONに設定
            },
            body: JSON.stringify(trackIds), // トラックIDの配列をリクエストボディに設定
            credentials: 'include' // 認証情報を含める
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
