// app/api/playlists/followed/route.ts

import {NextRequest, NextResponse} from 'next/server';

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
            throw new Error('Cookie missing');
        }
        
        // sessionIdを抽出
        const sessionId = cookie.split('; ').find(row => row.startsWith('sessionId'))?.split('=')[1];
        if (!sessionId) {
            throw new Error('sessionId missing');
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
            const errorText = await response.text();
            console.error('バックエンドからのエラーレスポンス:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const data = await response.json();
        
        console.log('APIレスポンスを受信しました:', response.status);
        console.log('レスポンスデータ:', data);
        
        return data;
    } catch (error) {
        console.error('APIリクエスト中にエラーが発生しました:', error);
        
        if (error instanceof Error) {
            throw new Error(`Failed to ${method.toLowerCase()} favorite playlist: ${error.message}`);
        } else {
            throw new Error(`Failed to ${method.toLowerCase()} favorite playlist: Unknown error`);
        }
    }
};

export async function POST(req: NextRequest): Promise<NextResponse> {
    console.log('POSTハンドラーが呼び出されました');
    
    try {
        const result = await handleFavoritePlaylist(req, 'POST');
        console.log('お気に入りプレイリストの追加に成功しました:', result);
        
        return NextResponse.json(result);
    } catch (error) {
        console.error('POSTハンドラーでエラーが発生しました:', error);
        
        if (error instanceof Error) {
            return NextResponse.json({error: `お気に入りプレイリストの追加中にエラーが発生しました: ${error.message}`}, {status: 500});
        } else {
            return NextResponse.json({error: 'お気に入りプレイリストの追加中にエラーが発生しました: Unknown error'}, {status: 500});
        }
    }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
    console.log('DELETEハンドラーが呼び出されました');
    
    try {
        const result = await handleFavoritePlaylist(req, 'DELETE');
        console.log('お気に入りプレイリストの削除に成功しました:', result);
        
        return NextResponse.json(result);
    } catch (error) {
        console.error('DELETEハンドラーでエラーが発生しました:', error);
        
        if (error instanceof Error) {
            return NextResponse.json({error: `お気に入りプレイリストの削除中にエラーが発生しました: ${error.message}`}, {status: 500});
        } else {
            return NextResponse.json({error: 'お気に入りプレイリストの削除中にエラーが発生しました: Unknown error'}, {status: 500});
        }
    }
}
