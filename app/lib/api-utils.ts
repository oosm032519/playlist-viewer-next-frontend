// app/lib/api-utils.ts

import {NextResponse} from 'next/server';
import {
    ApiError,
    NotFoundError,
    UnauthorizedError,
    BadRequestError,
    ForbiddenError
} from './errors';

/**
 * APIエラーを処理し、適切なHTTPレスポンスを返します。
 *
 * @param error - 処理するエラーオブジェクト。通常はAPI呼び出しで発生するエラー。
 * @returns エラーメッセージとステータスコードを含むNext.jsのレスポンスオブジェクト。
 *
 * @example
 * ```typescript
 * try {
 *   // API呼び出し
 * } catch (error) {
 *   return handleApiError(error);
 * }
 * ```
 */
export async function handleApiError(error: unknown): Promise<NextResponse> {
    // エラー内容をコンソールに出力
    console.error('API Error:', error);
    
    // エラーがApiErrorのインスタンスである場合、カスタムエラーメッセージとステータスを返す
    if (error instanceof ApiError) {
        return NextResponse.json(
            {error: error.message, details: error.details},
            {status: error.status}
        );
    }
    
    // 予期しないエラーの場合、500ステータスで汎用的なエラーメッセージを返す
    return NextResponse.json(
        {error: 'Internal Server Error', details: '予期しないエラーが発生しました'},
        {status: 500}
    );
}
