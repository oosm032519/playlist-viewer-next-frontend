// app/api/login/route.ts
import {NextResponse} from 'next/server';

const BACKENDURL = process.env.BACKEND_URL || 'http://localhost:8080';
const APIURL = `${BACKENDURL}/oauth2/authorization/spotify`;

export async function GET() {
    return NextResponse.redirect(APIURL);
}
