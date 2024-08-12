// app/api/session/sessionId/route.ts

import {NextResponse} from 'next/server';
import {handleApiError} from '@/app/lib/api-utils';
import {BadRequestError} from '@/app/lib/errors';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export async function POST(request: Request) {
    const {temporaryToken} = await request.json();
    
    if (!temporaryToken) {
        return handleApiError(new BadRequestError('一時トークンが提供されていません'));
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
            const errorData = await response.json();
            throw new Error(`セッションIDの取得に失敗しました: ${errorData.details || '不明なエラー'}`);
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
        return handleApiError(error);
    }
}
