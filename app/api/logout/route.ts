// app/api/logout/route.ts

import {NextResponse} from 'next/server';

export async function POST(request: Request) {
    console.log('logout関数が呼び出されました');
    
    if (request.method !== 'POST') {
        return NextResponse.json({error: `Method ${request.method} Not Allowed`}, {status: 405});
    }
    
    try {
        console.log('APIリクエストを送信します:', 'http://localhost:8080/api/logout');
        
        const cookies = request.headers.get('cookie') || '';
        console.log('リクエストヘッダー:', cookies);
        
        const response = await fetch('http://localhost:8080/api/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies,
            },
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('APIレスポンスエラー:', errorData);
            return NextResponse.json({error: `ログアウト失敗: ${response.statusText}`}, {status: response.status});
        }
        
        const responseData = await response.json();
        console.log('APIレスポンスを受信しました:', response.status);
        console.log('レスポンスデータ:', responseData);
        
        return NextResponse.json({message: 'ログアウトしました'}, {status: 200});
    } catch (error) {
        console.error('APIリクエスト中にエラーが発生しました:', error);
        return NextResponse.json({error: 'ログアウト失敗: ログアウトエラー'}, {status: 500});
    }
}
