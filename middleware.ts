import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';
 
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    let cookie = request.cookies.get('jwt')?.value;
    if (!cookie) {
      return NextResponse.rewrite(new URL('/login', request.url));
    }
    
    const auth = await verifyJWT(process.env.JWT_KEY,cookie);
    if (!auth?.verified) {
      return NextResponse.rewrite(new URL('/login', request.url));
    }
  }
}