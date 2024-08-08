// app/api/playlists/remove-track/route.ts

import {NextRequest} from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
    console.log("POST request received to remove track from playlist");
    try {
        const {playlistId, trackId} = await request.json();
        console.log(`Received request to remove track ${trackId} from playlist ${playlistId}`);
        
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        console.log(`Using backend URL: ${backendUrl}`);
        
        // リクエストからCookieを取得
        const cookie = request.headers.get('Cookie');
        console.log(`[${new Date().toISOString()}] Cookieを取得: ${cookie}`);
        
        if (!cookie) {
            return new Response(JSON.stringify({error: "Cookieが見つかりません"}), {
                status: 401,
                headers: {'Content-Type': 'application/json'}
            });
        }
        
        const response = await fetch(`${backendUrl}/api/playlist/remove-track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie, // CookieをそのままCookieヘッダーに設定
            },
            body: JSON.stringify({playlistId, trackId}),
            credentials: 'include', // クレデンシャルを含める
        });
        
        // レスポンスがOKかどうかを確認
        if (response.ok) {
            // OKの場合は、レスポンスをJSONとして解析し、クライアントに返す
            const responseData = await response.json();
            return new Response(JSON.stringify(responseData), {
                status: response.status,
                headers: {'Content-Type': 'application/json'}
            });
        } else {
            // OKでない場合は、エラーメッセージをクライアントに返す
            const errorData = await response.json();
            return new Response(JSON.stringify({error: "トラックの削除に失敗しました", details: errorData}), {
                status: response.status,
                headers: {'Content-Type': 'application/json'}
            });
        }
    } catch (error) {
        console.error("Error removing track from playlist:", error);
        return new Response(
            JSON.stringify({error: "トラックの削除に失敗しました", details: "不明なエラー"}),
            {status: 500, headers: {'Content-Type': 'application/json'}}
        );
    }
}
