// app/middleware/auth.ts

import {NextRequest, NextResponse} from 'next/server';
import {getCookies, handleApiError, sendRequest} from '@/app/lib/api-utils';
import {UnauthorizedError} from '@/app/lib/errors';

/**
 * 認証ミドルウェア
 *
 * @param request - Next.jsのNextRequestオブジェクト
 * @returns 認証成功時はundefined、失敗時はエラーレスポンス
 */
export async function authMiddleware(request: NextRequest): Promise<Response| NextResponse | undefined> {
    const cookies = getCookies(request);
    const sessionId = cookies.split('; ').find(row => row.startsWith('sessionId'))?.split('=')[1];
    
    if (!sessionId) {
        return handleApiError(new UnauthorizedError('sessionIdが見つかりません'));
    }
    
    try {
        await sendRequest('/api/session/check', 'GET', undefined, cookies);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * ミドルウェアを適用する関数
 *
 * @param handler - APIルートハンドラ
 * @returns ミドルウェアが適用されたハンドラ
 */
export const withAuth = (handler: (request: NextRequest) => Promise<Response>) => {
    return async (request: NextRequest) => {
        const authResponse = await authMiddleware(request);
        if (authResponse) {
            return authResponse;
        }
        return handler(request);
    };
};
