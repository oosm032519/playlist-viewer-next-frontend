import {NextResponse} from 'next/server';

export async function GET(
    request: Request,
    {params}: { params: { id: string } }
) {
    const id = params.id;
    
    try {
        const backendUrl = process.env.BACKEND_URL || 'http://localhonnNst:8080';
        const fullUrl = `${backendUrl}/api/playlists/${id}`;
        
        console.log(`Sending request to: ${fullUrl}`);
        
        const response = await fetch(fullUrl);
        
        console.log(`Response status: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // レスポンスをテキストとして読み取る
        const textData = await response.text();
        console.log('Raw response:', textData);
        
        // JSONとしてパースを試みる
        let data;
        try {
            data = JSON.parse(textData);
        } catch (parseError) {
            console.error('Failed to parse response as JSON:', parseError);
            // テキストデータをそのまま返す
            return NextResponse.json({message: textData});
        }
        
        console.log('Parsed data:', data);
        
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching playlist:", error);
        return NextResponse.json({error: "Failed to fetch playlist"}, {status: 500});
    }
}
