// app/api/session/mock-login/route.ts

import {NextResponse} from 'next/server';

export async function POST(): Promise<NextResponse> {
    // Spring Boot のモックログインエンドポイントのURL
    const backendMockLoginUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/session/mock-login`;
    
    try {
        const responseFromBackend = await fetch(backendMockLoginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!responseFromBackend.ok) {
            // バックエンドからのエラーレスポンスをそのまま返す
            return new NextResponse(await responseFromBackend.text(), {
                status: responseFromBackend.status,
                headers: responseFromBackend.headers,
            });
        }
        
        const data = await responseFromBackend.json();
        const mockUserId = data.userId; // バックエンドから userId を取得
        
        const response = NextResponse.json({userId: mockUserId}, {status: 200});
        
        // Set-Cookie ヘッダーから sessionId Cookie を取得して設定
        const sessionIdCookie = responseFromBackend.headers.get('Set-Cookie');
        if (sessionIdCookie) {
            response.headers.set('Set-Cookie', sessionIdCookie); // Set-Cookie ヘッダーをそのまま設定
        }
        
        return response;
        
    } catch (error) {
        console.error("バックエンドのモックログインエンドポイント呼び出しエラー:", error);
        return new NextResponse(JSON.stringify({error: "バックエンドのモックログイン処理でエラーが発生しました"}), {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        });
    }
}
