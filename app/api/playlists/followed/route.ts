import {NextRequest, NextResponse} from 'next/server';

/**
 * フォロー中のプレイリストを取得する非同期関数
 * @param {NextRequest} req - Next.jsのリクエストオブジェクト
 * @returns {Promise<any>} フォロー中のプレイリストデータ
 * @throws {Error} APIリクエストが失敗した場合にエラーをスロー
 */
const getFollowedPlaylists = async (req: NextRequest): Promise<any> => {
    console.log('getFollowedPlaylists関数が呼び出されました');
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    const apiUrl = `${backendUrl}/api/playlists/followed`;
    
    try {
        console.log('APIリクエストを送信します:', apiUrl);
        
        // リクエストからCookieを取得
        const cookie = req.headers.get('Cookie');
        console.log('Cookie:', cookie);
        
        if (!cookie) {
            throw new Error('Cookie missing');
        }
        
        // JSESSIONIDを抽出
        const jsessionid = cookie.split('; ').find(row => row.startsWith('JSESSIONID'))?.split('=')[1];
        if (!jsessionid) {
            throw new Error('JSESSIONID missing');
        }
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Cookie': `JSESSIONID=${jsessionid}`, // JSESSIONIDのみをヘッダーにセット
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
