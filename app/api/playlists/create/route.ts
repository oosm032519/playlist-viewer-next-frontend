import {NextRequest} from "next/server";
import {handleApiError} from '@/app/lib/api-utils';
import {UnauthorizedError} from '@/app/lib/errors';

/**
 * プレイリスト作成のためのPOSTメソッドを処理する非同期関数
 * @param {NextRequest} request - クライアントからのリクエスト
 * @returns {Promise<Response>} - 作成されたプレイリストのレスポンス
 */
export async function POST(request: NextRequest): Promise<Response> {
    try {
        // リクエストボディからトラックIDの配列を取得
        const trackIds: string[] = await request.json();
        
        // バックエンドAPIのエンドポイントURLを環境変数から取得、デフォルトはローカルホスト
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        
        // sessionIdを取得
        const sessionId = request.cookies.get('sessionId')?.value;
        
        // バックエンドAPIに対してプレイリスト作成リクエストを送信
        const response = await fetch(`${backendUrl}/api/playlists/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': sessionId ? `sessionId=${sessionId}` : ''
            },
            body: JSON.stringify(trackIds),
            credentials: 'include',
        });
        
        // レスポンスが正常でない場合はエラーをスロー
        if (!response.ok) {
            if (response.status === 401) {
                throw new UnauthorizedError('認証されていません');
            } else {
                const errorData = await response.json();
                throw new Error(`プレイリストの作成に失敗しました: ${errorData.details || '不明なエラー'}`);
            }
        }
        
        // レスポンスボディをJSONとしてパース
        const data = await response.json();
        
        // 成功したレスポンスを返す
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        return handleApiError(error);
    }
}
