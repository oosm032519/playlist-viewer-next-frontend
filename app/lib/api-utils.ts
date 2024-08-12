// app/lib/api-utils.ts

import {NextResponse} from 'next/server';
import {
    ApiError,
    NotFoundError,
    UnauthorizedError,
    BadRequestError,
    ForbiddenError
} from './errors';

export async function handleApiError(error: unknown): Promise<NextResponse> {
    console.error('API Error:', error);
    
    if (error instanceof ApiError) {
        return NextResponse.json(
            {error: error.message, details: error.details},
            {status: error.status}
        );
    }
    
    // 予期しないエラーの場合
    return NextResponse.json(
        {error: 'Internal Server Error', details: '予期しないエラーが発生しました'},
        {status: 500}
    );
}
