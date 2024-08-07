// app/api/session/create/route.ts

import {NextResponse} from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export async function POST(request: Request) {
    const {token} = await request.json();
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/session/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token}),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const sessionId = await response.text();
        
        // レスポンスを作成
        const nextResponse = NextResponse.json({success: true}, {status: 200});
        
        // セッションIDをHTTP-only Cookieとして設定
        nextResponse.cookies.set('session_id', sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 3600 // 1時間
        });
        
        return nextResponse;
    } catch (error) {
        console.error('Error setting session:', error);
        return NextResponse.json({error: 'Failed to set session'}, {status: 500});
    }
}
