// app/api/playlists/favorites/route.ts

import {NextRequest, NextResponse} from 'next/server';

const getFavoritePlaylists = async (req: NextRequest): Promise<any> => {
    console.log('getFavoritePlaylists関数が呼び出されました');
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    const apiUrl = `${backendUrl}/api/playlists/favorites`;
    
    try {
        console.log('APIリクエストを送信します:', apiUrl);
        
        // リクエストからCookieを取得
        const cookie = req.headers.get('Cookie');
        console.log('Cookie:', cookie);
        
        if (!cookie) {
            throw new Error('Cookie missing');
        }
        
        // sessionIdを抽出
        const sessionId = cookie.split('; ').find(row => row.startsWith('sessionId'))?.split('=')[1];
        if (!sessionId) {
            throw new Error('sessionId missing');
        }
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Cookie': `sessionId=${sessionId}`, // sessionIdのみをヘッダーにセット
            },
            credentials: 'include', // クレデンシャルを含める
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('APIレスポンスを受信しました:', response.status);
        console.log('レスポンスデータ:', data);
        
        return data;
    } catch (error) {
        console.error('APIリクエスト中にエラーが発生しました:', error);
        
        if (error instanceof Error) {
            throw new Error(`Failed to fetch favorite playlists: ${error.message}`);
        } else {
            throw new Error('Failed to fetch favorite playlists: Unknown error');
        }
    }
};

function createResponse(body: any, status: number = 200): NextResponse {
    const response = NextResponse.json(body, {status});
    
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    console.log('GETハンドラーが呼び出されました');
    
    try {
        const playlists = await getFavoritePlaylists(req);
        console.log('お気に入りプレイリストの取得に成功しました:', playlists);
        
        return createResponse(playlists);
    } catch (error) {
        console.error('GETハンドラーでエラーが発生しました:', error);
        
        if (error instanceof Error) {
            return createResponse({error: `お気に入りプレイリストの取得中にエラーが発生しました: ${error.message}`}, 500);
        } else {
            return createResponse({error: 'お気に入りプレイリストの取得中にエラーが発生しました: Unknown error'}, 500);
        }
    }
}
