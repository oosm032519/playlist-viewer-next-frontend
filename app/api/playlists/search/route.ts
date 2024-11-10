// app/api/playlists/search/route.ts

import {handleApiError, sendRequest} from '@/app/lib/api-utils';
import {BadRequestError} from '@/app/lib/errors';
import {NextRequest} from 'next/server';

/**
 * プレイリスト検索を行う関数
 *
 * @param {string} query - 検索クエリ
 * @param {number} offset - 結果のオフセット
 * @param {number} limit - 取得する結果の数
 * @returns {Promise<any>} 検索結果のJSONデータ
 * @throws {Error} ネットワークエラーやAPIエラーが発生した場合
 */
async function searchPlaylists(query: string, offset: number, limit: number): Promise<any> {
    try {
        // プレイリスト検索APIにGETリクエストを送信
        const response = await sendRequest(`/api/playlists/search?query=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}`, 'GET');
        
        // JSONデータを取得して返す
        return await response.json();
    } catch (error) {
        // エラーをハンドリング
        return handleApiError(error);
    }
}

/**
 * GETリクエストを処理する関数
 *
 * @param {Request} request - リクエストオブジェクト
 * @returns {Promise<Response>} レスポンスオブジェクト
 */
export async function GET(request: NextRequest): Promise<Response> {
    
    // リクエストURLからクエリパラメータを取得
    const {searchParams} = new URL(request.url);
    const query = searchParams.get('query');
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    
    // クエリが指定されていない場合は400エラーを返す
    if (!query) {
        return handleApiError(new BadRequestError('クエリパラメータが必須です'));
    }
    
    try {
        // プレイリストを検索し、結果をJSON形式で返す
        const playlists = await searchPlaylists(query, offset, limit);
        return new Response(JSON.stringify(playlists), {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        // エラーをハンドリング
        return handleApiError(error);
    }
}
