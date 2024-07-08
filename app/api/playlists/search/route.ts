// app/api/playlists/search/route.ts
import {NextResponse} from 'next/server'
import axios from 'axios'

const apiUrl = 'http://localhost:8080/api' // APIのベースURLを定数化

async function searchPlaylists(query: string, offset: number, limit: number) { // プレイリスト検索を行う関数を定義
    try {
        const response = await axios.get(`${apiUrl}/playlists/search?query=${query}&offset=${offset}&limit=${limit}`)
        console.log('プレイリスト検索APIからレスポンスを受信しました')
        console.log(`レスポンスデータ: ${JSON.stringify(response.data)}`)
        return response.data
    } catch (error) {
        console.error('プレイリスト取得中にエラーが発生しました:', error)
        throw new Error('Failed to fetch playlists') // エラーを明示的にスロー
    }
}

export async function GET(request: Request) {
    console.log('GET リクエストを受信しました')
    
    const {searchParams} = new URL(request.url)
    const query = searchParams.get('query')
    const offset = parseInt(searchParams.get('offset') || '0', 10); // offsetパラメータを取得、デフォルトは0
    const limit = parseInt(searchParams.get('limit') || '20', 10); // limitパラメータを取得、デフォルトは20
    console.log(`クエリパラメータ: ${query}, offset: ${offset}, limit: ${limit}`);
    
    if (!query) {
        console.log('クエリパラメータが指定されていません。400エラーを返します')
        return NextResponse.json({error: 'Query parameter is required'}, {status: 400})
    }
    
    try {
        const playlists = await searchPlaylists(query, offset, limit) // プレイリスト検索関数を呼び出す
        return NextResponse.json(playlists)
    } catch (error) {
        console.log('500エラーを返します')
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500})
    }
}
