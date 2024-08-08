// app/api/playlists/add-track/route.ts

import {NextRequest} from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
    console.log(`[${new Date().toISOString()}] POST リクエスト開始: /api/playlists/add-track`);
    try {
        const {playlistId, trackId} = await request.json();
        console.log(`[${new Date().toISOString()}] リクエストボディ解析完了: playlistId=${playlistId}, trackId=${trackId}`);
        
        const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
        console.log(`[${new Date().toISOString()}] バックエンドURL: ${backendUrl}`);
        
        const cookies = request.headers.get('cookie') || '';
        
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
        
        const data = await response.json();
        console.log(`[${new Date().toISOString()}] バックエンドAPIレスポンス内容:`, JSON.stringify(data));
        
        console.log(`[${new Date().toISOString()}] クライアントへのレスポンス送信: ステータス=${response.status}`);
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {'Content-Type': 'application/json'},
        });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] エラー発生:`, error);
        // エラーレスポンスを返す
        return new Response(
            JSON.stringify({
                error: "プレイリストへのトラック追加に失敗しました",
                details: error instanceof Error ? error.message : "不明なエラー"
            }),
            {status: 500, headers: {'Content-Type': 'application/json'}}
        );
    } finally {
        console.log(`[${new Date().toISOString()}] POST リクエスト終了: /api/playlists/add-track`);
    }
}
