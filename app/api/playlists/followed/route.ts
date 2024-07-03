import {NextRequest, NextResponse} from 'next/server';
import axios, {AxiosError} from 'axios';

const getFollowedPlaylists = async (req: NextRequest) => {
    console.log('getFollowedPlaylists関数が呼び出されました'); // 関数の開始をログ出力
    
    try {
        console.log('APIリクエストを送信します:', 'http://localhost:8080/api/playlists/followed'); // リクエスト送信前のログ
        console.log('リクエストヘッダー:', req.headers.get('cookie')); // Cookieヘッダーの内容をログ出力
        
        const response = await axios.get('http://localhost:8080/api/playlists/followed', {
            withCredentials: true,
            headers: {
                'Cookie': req.headers.get('cookie') || '',
            },
        });
        
        console.log('APIレスポンスを受信しました:', response.status); // レスポンスのステータスコードをログ出力
        console.log('レスポンスデータ:', response.data); // レスポンスデータをログ出力
        
        return response.data;
    } catch (error) {
        console.error('APIリクエスト中にエラーが発生しました:', error); // エラーの詳細をログ出力
        
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error('Axiosエラーの詳細:', axiosError.response?.data); // Axiosエラーの詳細をログ出力
            throw new Error(`Failed to fetch playlists: ${axiosError.message}`);
        }
        throw new Error('Failed to fetch playlists: Unknown error');
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
        return NextResponse.json({error: 'フォロー中のプレイリストの取得中にエラーが発生しました。'}, {status: 500});
    }
}
