// app/api/test-cookie/route.ts

import {NextResponse} from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

const fetchTestCookie = async () => {
    const fullUrl = `${BACKEND_URL}/api/test-cookie`;
    console.log(`フルURL: ${fullUrl}`);
    
    try {
        console.log(`リクエストを開始: ${fullUrl}`);
        const response = await fetch(fullUrl, {
            credentials: 'include',
        });
        console.log(`レスポンスステータス: ${response.status}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error(`エラーステータス: ${response.status}`);
            console.error(`エラーデータ: ${JSON.stringify(errorData)}`);
            throw new Error(`HTTPエラー: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`レスポンスデータ: ${JSON.stringify(data)}`);
        return data;
    } catch (error) {
        console.error("テストCookieの取得中にエラーが発生しました:", error);
        throw error;
    }
};

const sendTestCookie = async (cookie: string, jsessionid: string) => {
    const fullUrl = `${BACKEND_URL}/api/test-cookie`;
    console.log(`フルURL: ${fullUrl}`);
    
    try {
        console.log(`リクエストを開始: ${fullUrl}`);
        const response = await fetch(fullUrl, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `testCookie=${cookie}; JSESSIONID=${jsessionid}`
            },
        });
        console.log(`レスポンスステータス: ${response.status}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error(`エラーステータス: ${response.status}`);
            console.error(`エラーデータ: ${JSON.stringify(errorData)}`);
            throw new Error(`HTTPエラー: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`レスポンスデータ: ${JSON.stringify(data)}`);
        return data;
    } catch (error) {
        console.error("テストCookieの送信中にエラーが発生しました:", error);
        throw error;
    }
};

export async function GET(request: Request) {
    console.log('GET関数が呼び出されました');
    
    try {
        console.log('fetchTestCookie関数を呼び出し');
        const data = await fetchTestCookie();
        console.log('取得されたデータ:', data);
        console.log('NextResponseを作成中...');
        
        const response = NextResponse.json(data, {status: 200});
        
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
        
        if (error instanceof Error && error.message.includes('HTTPエラー')) {
            const status = parseInt(error.message.split(': ')[1], 10);
            if (status === 404) {
                return NextResponse.json({error: "テストCookieが見つかりません"}, {status: 404});
            } else if (status === 500) {
                return NextResponse.json({error: "テストCookieの取得中にサーバーエラーが発生しました"}, {status: 500});
            }
        }
        
        return NextResponse.json({error: "テストCookieの取得中に予期せぬエラーが発生しました"}, {status: 500});
    }
}

export async function POST(request: Request) {
    console.log('POST関数が呼び出されました');
    
    try {
        const cookie = request.headers.get('cookie');
        if (!cookie) {
            return NextResponse.json({error: "Cookieが見つかりません"}, {status: 400});
        }
        
        const testCookie = cookie.split(';').find(c => c.trim().startsWith('testCookie='));
        const jsessionid = cookie.split(';').find(c => c.trim().startsWith('JSESSIONID='));
        
        if (!testCookie || !jsessionid) {
            return NextResponse.json({error: "必要なCookieが見つかりません"}, {status: 400});
        }
        
        const testCookieValue = testCookie.split('=')[1];
        const jsessionidValue = jsessionid.split('=')[1];
        
        console.log('sendTestCookie関数を呼び出し');
        const data = await sendTestCookie(testCookieValue, jsessionidValue);
        console.log('送信されたデータ:', data);
        console.log('NextResponseを作成中...');
        
        return NextResponse.json(data, {status: 200});
    } catch (error) {
        console.error("テストCookieの送信に失敗しました:", error);
        console.log('エラーレスポンスを作成中...');
        
        if (error instanceof Error && error.message.includes('HTTPエラー')) {
            const status = parseInt(error.message.split(': ')[1], 10);
            if (status === 404) {
                return NextResponse.json({error: "テストCookieが見つかりません"}, {status: 404});
            } else if (status === 500) {
                return NextResponse.json({error: "テストCookieの送信中にサーバーエラーが発生しました"}, {status: 500});
            }
        }
        
        return NextResponse.json({error: "テストCookieの送信中に予期せぬエラーが発生しました"}, {status: 500});
    }
}
