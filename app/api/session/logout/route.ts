// app/api/session/logout/route.ts

import {NextRequest, NextResponse} from "next/server";
import {handleApiError} from '@/app/lib/api-utils';
import {UnauthorizedError} from '@/app/lib/errors';

export async function POST(request: NextRequest): Promise<Response> {
    console.log(`[${new Date().toISOString()}] POST リクエスト開始: /api/session/logout`);
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        const cookies = request.headers.get('cookie') || '';
        
        // sessionIdを抽出
        const sessionId = cookies.split('; ').find(row => row.startsWith('sessionId'))?.split('=')[1];
        if (!sessionId) {
            throw new UnauthorizedError('sessionIdが見つかりません');
        }
        
        console.log(`[${new Date().toISOString()}] バックエンドAPIリクエスト開始: ${backendUrl}/api/session/logout`);
        const response = await fetch(`${backendUrl}/api/session/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `sessionId=${sessionId}`, // sessionIdのみをヘッダーにセット
            },
        });
        console.log(`[${new Date().toISOString()}] バックエンドAPIレスポンス受信: ステータス=${response.status}`);
        
        if (!response.ok) {
            throw new Error(`ログアウトに失敗しました: ${response.status}`);
        }
        
        const nextResponse = NextResponse.json(null, {
            status: response.status,
        });
        
        // sessionId Cookieを削除
        nextResponse.cookies.set({
            name: 'sessionId',
            value: '',
            path: '/',
            maxAge: 0,
        });
        
        console.log(`[${new Date().toISOString()}] sessionId Cookieを削除しました`);
        
        return nextResponse;
    } catch (error) {
        return handleApiError(error);
    } finally {
        console.log(`[${new Date().toISOString()}] POST リクエスト終了: /api/session/logout`);
    }
}
