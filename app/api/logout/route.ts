// app/api/logout/route.ts

import {NextResponse} from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export async function POST(request: Request): Promise<NextResponse> {
    console.log('logout関数が呼び出されました');
    
    if (request.method !== 'POST') {
        return NextResponse.json({error: `Method ${request.method} Not Allowed`}, {status: 405});
    }
    
    try {
        const logoutUrl = `${BACKEND_URL}/api/logout`;
        console.log('APIリクエストを送信します:', logoutUrl);
        
        const cookies = request.headers.get('cookie') || '';
        console.log('リクエストヘッダー:', cookies);
        
        const response = await fetch(logoutUrl, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies,
            },
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('APIレスポンスエラー:', errorText);
            return NextResponse.json({error: `ログアウト失敗: ${response.statusText}`}, {status: response.status});
        }
        
        const responseText = await response.text();
        console.log('APIレスポンスを受信しました:', response.status);
        console.log('レスポンステキスト:', responseText);
        
        const message = responseText || 'ログアウトしました';
        
        return NextResponse.json({message}, {status: 200});
    } catch (error) {
        console.error('APIリクエスト中にエラーが発生しました:', error);
        return NextResponse.json({error: 'ログアウト失敗: ログアウトエラー'}, {status: 500});
    }
}
