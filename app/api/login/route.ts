// app/api/login/route.ts
import {NextResponse} from 'next/server';

const BACKENDURL = process.env.BACKEND_URL || 'http://localhost:8080';
const APIURL = `${BACKENDURL}/oauth2/authorization/spotify`;

export async function GET() {
    const loginUrl = process.env.NEXT_PUBLIC_SPOTIFY_AUTH_URL || APIURL;
    return NextResponse.redirect(loginUrl);
}
