// app/api/playlists/followed/route.ts
import {NextRequest, NextResponse} from 'next/server';

const BACKENDURL = process.env.BACKEND_URL || 'http://localhost:8080';
const APIURL = `${BACKENDURL}/api/playlists/followed`;

/**
 * フォロー中のプレイリストを取得する非同期関数
 * @param {NextRequest} req - Next.jsのリクエストオブジェクト
 * @returns {Promise<any>} フォロー中のプレイリストデータ
 * @throws {Error} APIリクエストが失敗した場合にエラーをスロー
 */
const getFollowedPlaylists = async (req: NextRequest): Promise<any> => {
    console.log('getFollowedPlaylists関数が呼び出されました');
    
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
            throw new Error(`Failed to fetch playlists: ${error.message}`);
        } else {
            throw new Error('Failed to fetch playlists: Unknown error');
        }
    }
};

/**
 * GETリクエストを処理するハンドラー関数
 * @param {NextRequest} req - Next.jsのリクエストオブジェクト
 * @returns {Promise<NextResponse>} フォロー中のプレイリストデータを含むレスポンス
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
    console.log('GETハンドラーが呼び出されました');
    
    try {
        const playlists = await getFollowedPlaylists(req);
        console.log('プレイリストの取得に成功しました:', playlists);
        
        return NextResponse.json(playlists);
    } catch (error) {
        console.error('GETハンドラーでエラーが発生しました:', error);
        
        if (error instanceof Error) {
            return NextResponse.json({error: `フォロー中のプレイリストの取得中にエラーが発生しました: ${error.message}`}, {status: 500});
        } else {
            return NextResponse.json({error: 'フォロー中のプレイリストの取得中にエラーが発生しました: Unknown error'}, {status: 500});
        }
    }
}
