// app/api/playlists/[id]/route.ts

import {NextResponse} from 'next/server';
import {handleApiError} from '@/app/lib/api-utils';

// バックエンドサーバーのURLを環境変数から取得
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

/**
 * プレイリストデータを取得する非同期関数
 * @param {string} id - プレイリストのID
 * @returns {Promise<any>} プレイリストデータ
 * @throws {Error} その他のHTTPエラーまたは処理エラー
 */
const fetchPlaylistData = async (id: string): Promise<Response> => {
    const fullUrl = `${BACKEND_URL}/api/playlists/${id}`;
    console.log(`フルURL: ${fullUrl}`);
    
    try {
        console.log(`リクエストを開始: ${fullUrl}`);
        const response = await fetch(fullUrl);
        console.log(`レスポンスステータス: ${response.status}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json({error: 'プレイリストが見つかりません'}, {status: 404});
            }
            throw new Error(`プレイリストの取得に失敗しました: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`レスポンスデータ: ${JSON.stringify(data)}`);
        return NextResponse.json(data);
    } catch (error) {
        return handleApiError(error);
    }
};

/**
 * GETリクエストを処理する関数
 * @param {Request} request - リクエストオブジェクト
 * @param {Object} context - コンテキストオブジェクト
 * @param {Object} context.params - パラメータオブジェクト
 * @param {string} context.params.id - プレイリストのID
 * @returns {Promise<NextResponse>} レスポンスオブジェクト
 */
export async function GET(
    request: Request,
    {params}: { params: { id: string } }
): Promise<Response> {
    console.log('GET関数が呼び出されました');
    console.log(`リクエストパラメータ: ${JSON.stringify(params)}`);
    
    const id = params.id;
    console.log(`プレイリストID: ${id}`);
    
    return fetchPlaylistData(id);
}
