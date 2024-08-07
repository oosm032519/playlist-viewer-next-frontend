// app/api/test-cookie/route.ts

import {NextResponse} from 'next/server';

// バックエンドサーバーのURLを環境変数から取得
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

/**
 * テストCookieを取得する非同期関数
 * @returns {Promise<any>} Cookieデータ
 * @throws {Error} HTTPエラーまたはその他のエラー
 */
const fetchTestCookie = async () => {
    // 完全なURLを構築
    const fullUrl = `${BACKEND_URL}/api/test-cookie`;
    console.log(`フルURL: ${fullUrl}`);
    
    try {
        console.log(`リクエストを開始: ${fullUrl}`);
        // 指定されたURLに対してHTTP GETリクエストを送信
        const response = await fetch(fullUrl, {
            credentials: 'include',  // Cookieを含める
        });
        console.log(`レスポンスステータス: ${response.status}`);
        
        // レスポンスが成功でない場合、エラーをスロー
        if (!response.ok) {
            const errorData = await response.json();
            console.error(`エラーステータス: ${response.status}`);
            console.error(`エラーデータ: ${JSON.stringify(errorData)}`);
            throw new Error(`HTTPエラー: ${response.status}`);
        }
        
        // レスポンスデータをJSON形式で取得
        const data = await response.json();
        console.log(`レスポンスデータ: ${JSON.stringify(data)}`);
        return data;
    } catch (error) {
        console.error("テストCookieの取得中にエラーが発生しました:", error);
        throw error;
    }
};

/**
 * GETリクエストを処理する関数
 * @param {Request} request - リクエストオブジェクト
 * @returns {Promise<NextResponse>} レスポンスオブジェクト
 */
export async function GET(request: Request) {
    console.log('GET関数が呼び出されました');
    
    try {
        console.log('fetchTestCookie関数を呼び出し');
        // テストCookieデータを取得
        const data = await fetchTestCookie();
        console.log('取得されたデータ:', data);
        console.log('NextResponseを作成中...');
        
        // レスポンスを作成
        const response = NextResponse.json(data, {status: 200});
        
        // バックエンドから受け取ったCookieをフロントエンドに設定
        if (data.testCookie) {
            response.cookies.set('testCookie', data.testCookie, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                path: '/'
            });
        }
        
        return response;
    } catch (error) {
        console.error("テストCookieの取得に失敗しました:", error);
        console.log('エラーレスポンスを作成中...');
        
        // エラーメッセージに基づいて適切なレスポンスを返す
        if (error instanceof Error && error.message.includes('HTTPエラー')) {
            const status = parseInt(error.message.split(': ')[1], 10);
            if (status === 404) {
                return NextResponse.json({error: "テストCookieが見つかりません"}, {status: 404});
            } else if (status === 500) {
                return NextResponse.json({error: "テストCookieの取得中にサーバーエラーが発生しました"}, {status: 500});
            }
        }
        
        // 予期せぬエラーの場合のレスポンス
        return NextResponse.json({error: "テストCookieの取得中に予期せぬエラーが発生しました"}, {status: 500});
    }
}
