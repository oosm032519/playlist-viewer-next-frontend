// app/api/mock-login/route.ts

import {NextResponse} from 'next/server';

export async function POST(): Promise<NextResponse> {
    const mockSessionId = 'mock-session-id'; // モックのセッションID
    const mockUserId = 'mock-user-id'; // モックのユーザーID
    
    const response = NextResponse.json({userId: mockUserId}, {status: 200});
    
    // sessionId Cookie を設定 (実処理と同じ設定)
    response.cookies.set('sessionId', mockSessionId, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1週間
    });
    
    return response;
}
