// app/api/playlists/followed/route.ts

import {NextRequest, NextResponse} from 'next/server';
import {handleApiError} from '@/app/lib/api-utils';
import {UnauthorizedError, BadRequestError} from '@/app/lib/errors';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

const handleFavoritePlaylist = async (req: NextRequest, method: 'POST' | 'DELETE'): Promise<any> => {
    console.log(`handle${method}FavoritePlaylist関数が呼び出されました`);
    
    const apiUrl = `${backendUrl}/api/playlists/favorite`;
    
    try {
        console.log('APIリクエストを送信します:', apiUrl);
        
        // リクエストからCookieを取得
        const cookie = req.headers.get('Cookie');
        console.log('Cookie:', cookie);
        
        if (!cookie) {
            throw new UnauthorizedError('Cookieが見つかりません');
        }
        
        // sessionIdを抽出
        const sessionId = cookie.split('; ').find(row => row.startsWith('sessionId'))?.split('=')[1];
        if (!sessionId) {
            throw new UnauthorizedError('sessionIdが見つかりません');
        }
        
        const body = await req.json();
        console.log('リクエストボディ:', body);  // ボディの内容をログ出力
        
        // URLSearchParamsを使用してクエリパラメータを構築
        const params = new URLSearchParams({
            playlistId: body.playlistId,
            playlistName: body.playlistName,
            totalTracks: body.totalTracks.toString(),
            playlistOwnerName: body.playlistOwnerName
        });
        
        const fullUrl = `${apiUrl}?${params.toString()}`;
        console.log('完全なURL:', fullUrl);
        
        const response = await fetch(fullUrl, {
            method: method,
            headers: {
                'Cookie': `sessionId=${sessionId}`, // sessionIdのみをヘッダーにセット
            },
            credentials: 'include', // クレデンシャルを含める
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new UnauthorizedError('認証されていません');
            } else if (response.status === 400) {
                throw new BadRequestError('不正なリクエストです');
            } else {
                const errorText = await response.text();
                console.error('バックエンドからのエラーレスポンス:', errorText);
                throw new Error(`お気に入りプレイリストの${method === 'POST' ? '追加' : '削除'}に失敗しました: ${errorText}`);
            }
        }
        
        const data = await response.json();
        
        console.log('APIレスポンスを受信しました:', response.status);
        console.log('レスポンスデータ:', data);
        
        return data;
    } catch (error) {
        return handleApiError(error);
    }
};

export async function POST(req: NextRequest): Promise<NextResponse> {
    console.log('POSTハンドラーが呼び出されました');
    
    try {
        const result = await handleFavoritePlaylist(req, 'POST');
        console.log('お気に入りプレイリストの追加に成功しました:', result);
        
        return NextResponse.json(result);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
    console.log('DELETEハンドラーが呼び出されました');
    
    try {
        const result = await handleFavoritePlaylist(req, 'DELETE');
        console.log('お気に入りプレイリストの削除に成功しました:', result);
        
        return NextResponse.json(result);
    } catch (error) {
        return handleApiError(error);
    }
}
