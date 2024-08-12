// app/api/playlists/search/route.ts.ts

import {NextResponse} from 'next/server';
import {handleApiError} from '@/app/lib/api-utils';
import {BadRequestError} from '@/app/lib/errors';

// 環境変数からバックエンドのURLを取得
const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

/**
 * プレイリスト検索を行う関数
 *
 * @param {string} query - 検索クエリ
 * @param {number} offset - 結果のオフセット
 * @param {number} limit - 取得する結果の数
 * @returns {Promise<any>} - 検索結果のJSONデータ
 * @throws {Error} - ネットワークエラーやAPIエラーが発生した場合
 */
async function searchPlaylists(query: string, offset: number, limit: number): Promise<any> {
    try {
        const response = await fetch(`${apiUrl}/api/playlists/search?query=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`プレイリストの検索に失敗しました: ${errorData.details || '不明なエラー'}`);
        }
        
        const data = await response.json();
        console.log('プレイリスト検索APIからレスポンスを受信しました');
        return data;
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * GETリクエストを処理する関数
 *
 * @param {Request} request - リクエストオブジェクト
 * @returns {Promise<Response>} - レスポンスオブジェクト
 */
export async function GET(request: Request): Promise<Response> {
    console.log('GET リクエストを受信しました');
    
    const {searchParams} = new URL(request.url);
    const query = searchParams.get('query');
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    
    if (!query) {
        console.log('クエリパラメータが指定されていません。400エラーを返します');
        return handleApiError(new BadRequestError('クエリパラメータが必須です'));
    }
    
    try {
        const playlists = await searchPlaylists(query, offset, limit);
        return NextResponse.json(playlists);
    } catch (error) {
        return handleApiError(error);
    }
}
