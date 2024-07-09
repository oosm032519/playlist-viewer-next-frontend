import {NextRequest, NextResponse} from 'next/server';

const getFollowedPlaylists = async (req: NextRequest) => {
    console.log('getFollowedPlaylists関数が呼び出されました'); // 関数の開始をログ出力
    
    try {
        console.log('APIリクエストを送信します:', 'http://localhost:8080/api/playlists/followed'); // リクエスト送信前のログ
        console.log('リクエストヘッダー:', req.headers.get('cookie')); // Cookieヘッダーの内容をログ出力
        
        const response = await fetch('http://localhost:8080/api/playlists/followed', {
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
        
        console.log('APIレスポンスを受信しました:', response.status); // レスポンスのステータスコードをログ出力
        console.log('レスポンスデータ:', data); // レスポンスデータをログ出力
        
        return data;
    } catch (error) {
        console.error('APIリクエスト中にエラーが発生しました:', error); // エラーの詳細をログ出力
        
        // errorを適切な型にキャスト
        if (error instanceof Error) {
            throw new Error(`Failed to fetch playlists: ${error.message}`);
        } else {
            throw new Error('Failed to fetch playlists: Unknown error');
        }
    }
};

export async function GET(req: NextRequest) {
    console.log('GETハンドラーが呼び出されました'); // ハンドラーの開始をログ出力
    
    try {
        const playlists = await getFollowedPlaylists(req);
        console.log('プレイリストの取得に成功しました:', playlists); // 成功時のデータをログ出力
        return NextResponse.json(playlists);
    } catch (error) {
        console.error('GETハンドラーでエラーが発生しました:', error); // エラーの詳細をログ出力
        
        // errorを適切な型にキャスト
        if (error instanceof Error) {
            return NextResponse.json({error: `フォロー中のプレイリストの取得中にエラーが発生しました: ${error.message}`}, {status: 500});
        } else {
            return NextResponse.json({error: 'フォロー中のプレイリストの取得中にエラーが発生しました。'}, {status: 500});
        }
    }
}
