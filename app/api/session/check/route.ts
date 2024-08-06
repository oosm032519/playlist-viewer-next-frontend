import {NextRequest, NextResponse} from 'next/server';

/**
 * レスポンスを作成し、キャッシュ制御ヘッダーを設定する関数
 *
 * @param {any} body - レスポンスボディ
 * @param {number} status - HTTPステータスコード（デフォルト: 200）
 * @returns {NextResponse} - キャッシュ制御ヘッダーが設定されたNextResponse
 */
function createResponse(body: any, status: number = 200): NextResponse {
    const response = NextResponse.json(body, {status});
    
    // キャッシュ制御ヘッダーを設定
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;
}

/**
 * セッションの状態をチェックするためのGETリクエストを処理します。
 *
 * @param {NextRequest} request - クライアントからのリクエストオブジェクト
 * @returns {Promise<NextResponse>} - セッションの状態を含むレスポンスオブジェクト
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
    console.log(`[${new Date().toISOString()}] GET /api/session/check - リクエスト開始`);
    
    try {
        // 環境変数からバックエンドのURLを取得
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
        console.log(`[${new Date().toISOString()}] 環境変数からバックエンドURLを取得: ${backendUrl}`);
        
        // リクエストヘッダーから Authorization ヘッダーを取得
        const authorizationHeader = request.headers.get('Authorization');
        console.log(`[${new Date().toISOString()}] リクエストヘッダーから Authorization ヘッダーを取得: ${authorizationHeader}`);
        
        // Authorization ヘッダーが存在しない場合エラー
        if (!authorizationHeader) {
            return createResponse({status: 'error', message: 'Authorization ヘッダーがありません'}, 401);
        }
        
        // セッションチェックのためのAPIリクエストを送信
        console.log(`[${new Date().toISOString()}] セッションチェックのためのAPIリクエストを送信: ${backendUrl}/api/session/check`);
        const response = await fetch(`${backendUrl}/api/session/check`, {
            headers: {
                'Authorization': authorizationHeader, // Authorization ヘッダーを設定
            },
        });
        
        // APIレスポンスのステータスコードをログ出力
        console.log(`[${new Date().toISOString()}] APIレスポンスステータス: ${response.status}`);
        
        // APIレスポンスをJSON形式で取得
        const data = await response.json();
        console.log(`[${new Date().toISOString()}] APIレスポンスデータを取得: ${JSON.stringify(data)}`);
        
        // セッションの状態を含むレスポンスを返す
        console.log(`[${new Date().toISOString()}] セッションの状態を含むレスポンスを返す`);
        return createResponse(data);
    } catch (error) {
        // エラーログをコンソールに出力
        console.error(`[${new Date().toISOString()}] セッションチェックエラー:`, error);
        
        // エラーレスポンスを返す
        console.log(`[${new Date().toISOString()}] エラーレスポンスを返す`);
        return createResponse({status: 'error', message: 'セッションチェックに失敗しました'}, 500);
    } finally {
        console.log(`[${new Date().toISOString()}] GET /api/session/check - リクエスト終了`);
    }
}
