import {NextResponse} from 'next/server';

export async function GET() {
    const loginUrl = process.env.NEXT_PUBLIC_SPOTIFY_AUTH_URL || 'http://localhost:8080/oauth2/authorization/spotify';
    return NextResponse.redirect(loginUrl);
}
