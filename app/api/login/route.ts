// app/api/login/route.ts
import {NextResponse} from 'next/server';

export async function GET() {
    const BACKENDURL = process.env.BACKEND_URL;
    const redirectUrl = `${BACKENDURL}/oauth2/authorization/spotify`;
    
    return NextResponse.json({redirectUrl});
}
