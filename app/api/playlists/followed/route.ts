// app/api/playlists/followed/route.ts
import {NextRequest, NextResponse} from 'next/server';

/**
 * フォロー中のプレイリストを取得する非同期関数
 * @param {NextRequest} req - Next.jsのリクエストオブジェクト
 * @returns {Promise<any>} フォロー中のプレイリストデータ
 * @throws {Error} APIリクエストが失敗した場合にエラーをスロー
 */
const getFollowedPlaylists = async (req: NextRequest): Promise<any> => {
    console.log('getFollowedPlaylists関数が呼び出されました'); // 関数の開始をログ出力
    
    try {
        // APIリクエストを送信する前にログを出力
        console.log('APIリクエストを送信します:', 'http://localhost:8080/api/playlists/followed');
        console.log('リクエストヘッダー:', req.headers.get('cookie')); // Cookieヘッダーの内容をログ出力
        
        // フォロー中のプレイリストを取得するためのAPIリクエストを送信
        const response = await fetch('http://localhost:8080/api/playlists/followed', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Cookie': req.headers.get('cookie') || '',
            },
        });
        
        // レスポンスが正常でない場合はエラーをスロー
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // レスポンスのJSONデータを取得
        const data = await response.json();
        
        // レスポンスのステータスコードとデータをログ出力
        console.log('APIレスポンスを受信しました:', response.status);
        console.log('レスポンスデータ:', data);
        
        // プレイリストデータを返す
        return data;
    } catch (error) {
        // エラーが発生した場合は詳細をログ出力
        console.error('APIリクエスト中にエラーが発生しました:', error);
        
        // errorを適切な型にキャストしてエラーメッセージをスロー
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
    console.log('GETハンドラーが呼び出されました'); // ハンドラーの開始をログ出力
    
    try {
        // フォロー中のプレイリストを取得
        const playlists = await getFollowedPlaylists(req);
        console.log('プレイリストの取得に成功しました:', playlists); // 成功時のデータをログ出力
        
        // プレイリストデータをJSON形式でレスポンスとして返す
        return NextResponse.json(playlists);
    } catch (error) {
        // エラーが発生した場合は詳細をログ出力
        console.error('GETハンドラーでエラーが発生しました:', error);
        
        // errorを適切な型にキャストしてエラーメッセージをレスポンスとして返す
        if (error instanceof Error) {
            return NextResponse.json({error: `フォロー中のプレイリストの取得中にエラーが発生しました: ${error.message}`}, {status: 500});
        } else {
            return NextResponse.json({error: 'フォロー中のプレイリストの取得中にエラーが発生しました。'}, {status: 500});
        }
    }
}
