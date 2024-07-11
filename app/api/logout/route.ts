// app/api/logout/route.ts

import {NextResponse} from 'next/server';

/**
 * POSTメソッドでログアウト処理を行う関数
 * @param {Request} request - クライアントからのリクエストオブジェクト
 * @returns {Promise<NextResponse>} - APIレスポンスを返すPromise
 */
export async function POST(request: Request): Promise<NextResponse> {
    console.log('logout関数が呼び出されました');

    // リクエストメソッドがPOSTでない場合、405 Method Not Allowedを返す
    if (request.method !== 'POST') {
        return NextResponse.json({error: `Method ${request.method} Not Allowed`}, {status: 405});
    }

    try {
        console.log('APIリクエストを送信します:', 'http://localhost:8080/api/logout');

        // リクエストヘッダーからクッキーを取得
        const cookies = request.headers.get('cookie') || '';
        console.log('リクエストヘッダー:', cookies);

        // ログアウトAPIにリクエストを送信
        const response = await fetch('http://localhost:8080/api/logout', {
            method: 'POST',
            credentials: 'include', // クッキーを含める
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies,
            },
        });

        // APIレスポンスが正常でない場合、エラーメッセージを返す
        if (!response.ok) {
            const errorData = await response.json();
            console.error('APIレスポンスエラー:', errorData);
            return NextResponse.json({error: `ログアウト失敗: ${response.statusText}`}, {status: response.status});
        }

        // 正常なレスポンスを受信した場合、成功メッセージを返す
        const responseData = await response.json();
        console.log('APIレスポンスを受信しました:', response.status);
        console.log('レスポンスデータ:', responseData);

        return NextResponse.json({message: 'ログアウトしました'}, {status: 200});
    } catch (error) {
        // APIリクエスト中にエラーが発生した場合、エラーメッセージを返す
        console.error('APIリクエスト中にエラーが発生しました:', error);
        return NextResponse.json({error: 'ログアウト失敗: ログアウトエラー'}, {status: 500});
    }
}
