// app/api/logout/route.ts

import {NextResponse} from 'next/server';
import axios, {AxiosError} from 'axios';

export async function POST(request: Request) {
    console.log('logout関数が呼び出されました');
    
    if (request.method !== 'POST') {
        return NextResponse.json({error: `Method ${request.method} Not Allowed`}, {status: 405});
    }
    
    try {
        console.log('APIリクエストを送信します:', 'http://localhost:8080/api/logout');
        
        const cookies = request.headers.get('cookie') || '';
        console.log('リクエストヘッダー:', cookies);
        
        const response = await axios.post('http://localhost:8080/api/logout', {}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies,
            },
        });
        
        console.log('APIレスポンスを受信しました:', response.status);
        console.log('レスポンスデータ:', response.data);
        
        return NextResponse.json({message: 'ログアウトしました'}, {status: 200});
    } catch (error) {
        console.error('APIリクエスト中にエラーが発生しました:', error);
        
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error('Axiosエラーの詳細:', axiosError.response?.data);
            return NextResponse.json({error: `ログアウト失敗: ${axiosError.message}`}, {status: 500});
        }
        return NextResponse.json({error: 'ログアウト失敗: ログアウトエラー'}, {status: 500});
    }
}
