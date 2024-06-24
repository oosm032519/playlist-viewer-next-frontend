// route.ts

import {NextResponse} from 'next/server'
import axios from 'axios'

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url)
    const query = searchParams.get('query')
    
    if (!query) {
        return NextResponse.json({error: 'Query parameter is required'}, {status: 400})
    }
    
    try {
        const response = await axios.get(`http://localhost:8080/api/playlists/search?query=${query}`)
        return NextResponse.json(response.data)
    } catch (error) {
        console.error('Error fetching playlists:', error)
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500})
    }
}
