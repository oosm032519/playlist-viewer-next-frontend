import {NextRequest, NextResponse} from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const response = await fetch('http://localhost:8080/api/session/check', {
            headers: {
                'Cookie': request.headers.get('Cookie') || '',
            },
            credentials: 'include',
        });
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('セッションチェックエラー:', error);
        return NextResponse.json({status: 'error', message: 'セッションチェックに失敗しました'}, {status: 500});
    }
}
