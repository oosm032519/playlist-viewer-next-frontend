// app/api/playlists/favorite/route.ts
import {NextRequest, NextResponse} from 'next/server';

const BACKENDURL = process.env.BACKEND_URL || 'http://localhost:8080';
const APIURL = `${BACKENDURL}/api/playlists/favorite`;

/**
 * お気に入りプレイリストを取得する非同期関数
 * @param {NextRequest} req - Next.jsのリクエストオブジェクト
 * @returns {Promise<any>} お気に入りプレイリストデータ
 * @throws {Error} APIリクエストが失敗した場合にエラーをスロー
 */
const getFavoritePlaylists = async (req: NextRequest): Promise<any> => {
    console.log('getFavoritePlaylists関数が呼び出されました');
    
    try {
        console.log('APIリクエストを送信します:', APIURL);
        console.log('リクエストヘッダー:', req.headers.get('cookie'));
        
        const response = await fetch(APIURL, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Cookie': req.headers.get('cookie') || '',
            },
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

/**
 * GETリクエストを処理するハンドラー関数
 * @param {NextRequest} req - Next.jsのリクエストオブジェクト
 * @returns {Promise<NextResponse>} お気に入りプレイリストデータを含むレスポンス
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
    console.log('GETハンドラーが呼び出されました');
    
    try {
        const playlists = await getFavoritePlaylists(req);
        console.log('お気に入りプレイリストの取得に成功しました:', playlists);
        
        return NextResponse.json(playlists);
    } catch (error) {
        console.error('GETハンドラーでエラーが発生しました:', error);
        
        if (error instanceof Error) {
            return NextResponse.json({error: `お気に入りプレイリストの取得中にエラーが発生しました: ${error.message}`}, {status: 500});
        } else {
            return NextResponse.json({error: 'お気に入りプレイリストの取得中にエラーが発生しました: Unknown error'}, {status: 500});
        }
    }
}

/**
 * POSTリクエストを処理するハンドラー関数
 * @param {NextRequest} req - Next.jsのリクエストオブジェクト
 * @returns {Promise<NextResponse>} お気に入り登録結果を含むレスポンス
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
    console.log('POSTハンドラーが呼び出されました');
    
    try {
        const url = new URL(req.url);
        const playlistId = url.searchParams.get('playlistId');
        const playlistName = url.searchParams.get('playlistName');
        const totalTracks = url.searchParams.get('totalTracks');
        const playlistOwnerName = url.searchParams.get('playlistOwnerName');
        
        if (!playlistId || !playlistName || !totalTracks || !playlistOwnerName) {
            return NextResponse.json({error: '必要なパラメータが不足しています'}, {status: 400});
        }
        
        const response = await fetch(`${APIURL}?playlistId=${playlistId}&playlistName=${encodeURIComponent(playlistName)}&totalTracks=${totalTracks}&playlistOwnerName=${encodeURIComponent(playlistOwnerName)}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Cookie': req.headers.get('cookie') || '',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('POSTハンドラーでエラーが発生しました:', error);
        
        if (error instanceof Error) {
            return NextResponse.json({error: `お気に入り登録中にエラーが発生しました: ${error.message}`}, {status: 500});
        } else {
            return NextResponse.json({error: 'お気に入り登録中にエラーが発生しました: Unknown error'}, {status: 500});
        }
    }
}

/**
 * DELETEリクエストを処理するハンドラー関数
 * @param {NextRequest} req - Next.jsのリクエストオブジェクト
 * @returns {Promise<NextResponse>} お気に入り解除結果を含むレスポンス
 */
export async function DELETE(req: NextRequest): Promise<NextResponse> {
    console.log('DELETEハンドラーが呼び出されました');
    
    try {
        const url = new URL(req.url);
        const playlistId = url.searchParams.get('playlistId');
        
        if (!playlistId) {
            return NextResponse.json({error: 'playlistIdが必要です'}, {status: 400});
        }
        
        const response = await fetch(`${APIURL}?playlistId=${playlistId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Cookie': req.headers.get('cookie') || '',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('DELETEハンドラーでエラーが発生しました:', error);
        
        if (error instanceof Error) {
            return NextResponse.json({error: `お気に入り解除中にエラーが発生しました: ${error.message}`}, {status: 500});
        } else {
            return NextResponse.json({error: 'お気に入り解除中にエラーが発生しました: Unknown error'}, {status: 500});
        }
    }
}
