// app/api/playlists/search/route.ts

import {NextResponse} from 'next/server';

const apiUrl = 'http://localhost:8080/api'; // APIのベースURLを定数化

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
        const response = await fetch(`${apiUrl}/playlists/search?query=${query}&offset=${offset}&limit=${limit}`, {
            method: 'GET',
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        console.log('プレイリスト検索APIからレスポンスを受信しました');
        console.log(`レスポンスデータ: ${JSON.stringify(data)}`);
        return data;
    } catch (error) {
        console.error('プレイリスト取得中にエラーが発生しました:', error);
        throw new Error('Failed to fetch playlists'); // エラーを明示的にスロー
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
    const offset = parseInt(searchParams.get('offset') || '0', 10); // offsetパラメータを取得、デフォルトは0
    const limit = parseInt(searchParams.get('limit') || '20', 10); // limitパラメータを取得、デフォルトは20
    console.log(`クエリパラメータ: ${query}, offset: ${offset}, limit: ${limit}`);
    
    if (!query) {
        console.log('クエリパラメータが指定されていません。400エラーを返します');
        return NextResponse.json({error: 'Query parameter is required'}, {status: 400});
    }
    
    try {
        const playlists = await searchPlaylists(query, offset, limit); // プレイリスト検索関数を呼び出す
        return NextResponse.json(playlists);
    } catch (error) {
        console.log('500エラーを返します');
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}
