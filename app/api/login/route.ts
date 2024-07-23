// app/api/login/route.ts
import {NextResponse} from 'next/server';

const BACKENDURL = process.env.BACKEND_URL || 'http://localhost:8080';
const APIURL = `${BACKENDURL}/oauth2/authorization/spotify`;

export async function GET() {
    console.log('Using BACKEND_URL:', BACKENDURL);
    console.log('Redirecting to Spotify login:', APIURL);
    return NextResponse.redirect(APIURL);
}
