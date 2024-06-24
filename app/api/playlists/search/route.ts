// route.ts

import {NextResponse} from 'next/server'
import axios from 'axios'

export async function GET(request: Request) {
    console.log('GET リクエストを受信しました')
    
    const {searchParams} = new URL(request.url)
    const query = searchParams.get('query')
    console.log(`クエリパラメータ: ${query}`)
    
    if (!query) {
        console.log('クエリパラメータが指定されていません。400エラーを返します')
        return NextResponse.json({error: 'Query parameter is required'}, {status: 400})
    }
    
    console.log('プレイリスト検索APIにリクエストを送信します')
    try {
        const response = await axios.get(`http://localhost:8080/api/playlists/search?query=${query}`)
        console.log('プレイリスト検索APIからレスポンスを受信しました')
        console.log(`レスポンスデータ: ${JSON.stringify(response.data)}`)
        return NextResponse.json(response.data)
    } catch (error) {
        console.error('プレイリスト取得中にエラーが発生しました:', error)
        console.log('500エラーを返します')
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500})
    }
}
