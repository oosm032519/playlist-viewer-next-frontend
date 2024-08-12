// app/api/playlists/remove-track/route.ts

import {NextRequest} from "next/server";
import {handleApiError} from '@/app/lib/api-utils';
import {NotFoundError, UnauthorizedError} from '@/app/lib/errors';

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
            throw new UnauthorizedError('Cookieが見つかりません');
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
        if (!response.ok) {
            if (response.status === 404) {
                throw new NotFoundError('プレイリストが見つかりません');
            } else if (response.status === 401) {
                throw new UnauthorizedError('認証されていません');
            } else {
                const errorData = await response.json();
                throw new Error(`トラックの削除に失敗しました: ${errorData.details || '不明なエラー'}`);
            }
        }
        
        // OKの場合は、レスポンスをJSONとして解析し、クライアントに返す
        const responseData = await response.json();
        return new Response(JSON.stringify(responseData), {
            status: response.status,
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        return handleApiError(error);
    }
}
