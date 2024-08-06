import {NextRequest, NextResponse} from 'next/server';
import {kv} from '@vercel/kv';
import {v4 as uuidv4} from 'uuid';

const SESSION_COOKIE_NAME = 'session_id';
const SESSION_EXPIRY = 60 * 60 * 24 * 7; // 1 week in seconds

export async function POST(request: NextRequest): Promise<NextResponse> {
    const {token} = await request.json();
    
    // Generate a random session ID
    const sessionId = uuidv4();
    
    // Store the JWT token in Vercel KV, associated with the session ID
    await kv.set(`session:${sessionId}`, token, {ex: SESSION_EXPIRY});
    
    // Set the session ID as an HTTP Only cookie
    const response = NextResponse.json({success: true});
    response.cookies.set(SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: SESSION_EXPIRY,
        path: '/',
    });
    
    return response;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    const sessionId = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    
    if (!sessionId) {
        return NextResponse.json({isLoggedIn: false});
    }
    
    const token = await kv.get(`session:${sessionId}`);
    
    if (!token) {
        return NextResponse.json({isLoggedIn: false});
    }
    
    return NextResponse.json({isLoggedIn: true, token});
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
    const sessionId = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    
    if (sessionId) {
        await kv.del(`session:${sessionId}`);
    }
    
    const response = NextResponse.json({success: true});
    response.cookies.delete(SESSION_COOKIE_NAME);
    
    return response;
}
