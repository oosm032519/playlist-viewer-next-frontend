// app/lib/api-utils.ts

import {NextRequest, NextResponse} from 'next/server';

import {ApiError} from '@/app/lib/errors';

/**
 * APIエラーを処理し、適切なHTTPレスポンスを返す
 *
 * @param error - 処理するエラーオブジェクト。通常はAPI呼び出しで発生するエラー
 * @param context - エラーが発生したコンテキスト情報（オプション）
 * @returns エラーメッセージとステータスコードを含むレスポンスオブジェクト
 */
export async function handleApiError(error: unknown, context?: string): Promise<NextResponse | Response> {
    console.error('API Error:', error, context);
    
    let status = 500;
    let message = 'Internal Server Error';
    let details = '予期しないエラーが発生しました';
    
    if (error instanceof ApiError) {
        status = error.status;
        message = error.message;
        details = error.details || '';
    } else if (error instanceof Response) {
        status = error.status;
        const errorData = await error.json();
        message = errorData.error || 'API Request Failed';
        details = errorData.details || error.statusText;
    } else if (error instanceof Error) {
        message = error.message;
        details = error.stack || '';
    }
    
    // エラーの種類に応じて詳細なメッセージを追加
    switch (status) {
        case 400:
            message = '入力内容に誤りがあります。もう一度確認してください。';
            details = 'リクエスト内容を確認してください。' + (details ? `\n詳細: ${details}` : '');
            break;
        case 401:
            message = 'ログインが必要です。ログインボタンからログインしてください。';
            break;
        case 403:
            message = 'アクセスが拒否されました';
            details = 'この操作を行う権限がありません。' + (details ? `\n詳細: ${details}` : '');
            break;
        case 404:
            message = 'リソースが見つかりません';
            details = 'お探しのリソースが見つかりません。' + (details ? `\n詳細: ${details}` : '');
            break;
        case 500:
            message = 'サーバーでエラーが発生しました。しばらくしてからもう一度お試しください。';
            details = '管理者に連絡してください。' + (details ? `\n詳細: ${details}` : '');
            break;
    }
    
    // コンテキスト情報があればメッセージに追加
    if (context) {
        details = `${context} でエラーが発生しました: ${details}`;
    }
    
    const responseBody = JSON.stringify({error: message, details: details});
    
    if (typeof Response !== 'undefined') {
        // ブラウザ環境
        return new Response(responseBody, {
            status: status,
            headers: {'Content-Type': 'application/json'}
        });
    } else {
        // Next.js環境
        return NextResponse.json(
            {error: message, details: details},
            {status: status}
        );
    }
}

/**
 * APIリクエストを送信する共通関数
 *
 * @param url - リクエスト先のURL
 * @param method - HTTPメソッド
 * @param body - リクエストボディ（オプション）
 * @param cookies - Cookieヘッダー（オプション）
 * @returns APIレスポンス
 * @throws handleApiError - APIリクエストが失敗した場合
 */
export async function sendRequest(url: string, method: string, body?: any, cookies?: string): Promise<Response> {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const response = await fetch(`${backendUrl}${url}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookies || '',
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include',
    });
    
    if (!response.ok) {
        throw response; // レスポンスオブジェクトをエラーとしてスロー
    }
    
    return response;
}

/**
 * リクエストからCookieを取得する関数
 *
 * @param request - Next.jsのNextRequestオブジェクト
 * @returns Cookie文字列
 */
export function getCookies(request: NextRequest): string {
    return request.headers.get('cookie') || '';
}
