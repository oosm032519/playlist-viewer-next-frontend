// app/api/playlists/[id]/route.ts.ts

import {NextResponse} from 'next/server';
import {handleApiError} from '@/app/lib/api-utils';
import {NotFoundError} from '@/app/lib/errors';

// バックエンドサーバーのURLを環境変数から取得
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

/**
 * プレイリストデータを取得する非同期関数
 * @param {string} id - プレイリストのID
 * @returns {Promise<any>} プレイリストデータ
 * @throws {Error} HTTPエラーまたはその他のエラー
 */
const fetchPlaylistData = async (id: string) => {
    // 完全なURLを構築
    const fullUrl = `${BACKEND_URL}/api/playlists/${id}`;
    console.log(`フルURL: ${fullUrl}`);
    
    try {
        console.log(`リクエストを開始: ${fullUrl}`);
        // 指定されたURLに対してHTTP GETリクエストを送信
        const response = await fetch(fullUrl);
        console.log(`レスポンスステータス: ${response.status}`);
        
        // レスポンスが成功でない場合、エラーをスロー
        if (!response.ok) {
            if (response.status === 404) {
                throw new NotFoundError('プレイリストが見つかりません');
            } else {
                const errorData = await response.json();
                console.error(`エラーステータス: ${response.status}`);
                console.error(`エラーデータ: ${JSON.stringify(errorData)}`);
                throw new Error(`プレイリストの取得に失敗しました: ${errorData.details || '不明なエラー'}`);
            }
        }
        
        // レスポンスデータをJSON形式で取得
        const data = await response.json();
        console.log(`レスポンスデータ: ${JSON.stringify(data)}`);
        return data;
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
) {
    console.log('GET関数が呼び出されました');
    console.log(`リクエストパラメータ: ${JSON.stringify(params)}`);
    
    const id = params.id;
    console.log(`プレイリストID: ${id}`);
    
    try {
        console.log(`fetchPlaylistData関数を呼び出し: ID = ${id}`);
        // プレイリストデータを取得
        const data = await fetchPlaylistData(id);
        console.log('取得されたデータ:', data);
        console.log('NextResponseを作成中...');
        // 成功レスポンスを返す
        return NextResponse.json(data, {status: 200});
    } catch (error) {
        return handleApiError(error);
    }
}
