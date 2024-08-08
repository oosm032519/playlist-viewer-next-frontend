// app/api/session/sessionId/route.ts

import {NextResponse} from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export async function POST(request: Request) {
    const {temporaryToken} = await request.json();
    
    if (!temporaryToken) {
        return NextResponse.json({error: "一時トークンが提供されていません"}, {status: 400});
    }
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/session/sessionId`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({temporaryToken}),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Create a new response
        const newResponse = NextResponse.json(data);
        
        // Set the cookie with HttpOnly flag
        newResponse.cookies.set('sessionId', data.sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });
        
        return newResponse;
    } catch (error) {
        console.error("セッションIDの取得中にエラーが発生しました:", error);
        return NextResponse.json({error: "セッションIDの取得に失敗しました"}, {status: 500});
    }
}
