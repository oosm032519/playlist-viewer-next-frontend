// app/api/playlists/search/route.ts

import {NextResponse} from 'next/server'
import axios from 'axios'

const apiUrl = 'http://localhost:8080/api' // APIのベースURLを定数化

async function searchPlaylists(query: string) { // プレイリスト検索を行う関数を定義
    try {
        const response = await axios.get(`${apiUrl}/playlists/search?query=${query}`)
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
    console.log(`クエリパラメータ: ${query}`)
    
    if (!query) {
        console.log('クエリパラメータが指定されていません。400エラーを返します')
        return NextResponse.json({error: 'Query parameter is required'}, {status: 400})
    }
    
    try {
        const playlists = await searchPlaylists(query) // プレイリスト検索関数を呼び出す
        return NextResponse.json(playlists)
    } catch (error) {
        console.log('500エラーを返します')
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500})
    }
}
