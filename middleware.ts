import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';
 
export async function middleware(request: NextRequest) {
  //if dashbord and no jwt -> login
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
  //if login and jwt -> dashboard
  if (request.nextUrl.pathname.startsWith('/login')||request.nextUrl.pathname.startsWith('/signup')) {
    let cookie = request.cookies.get('jwt')?.value;
    if (cookie) {
      const auth = await verifyJWT(process.env.JWT_KEY,cookie);
      if (auth?.verified) {
        return NextResponse.rewrite(new URL('/dashboard', request.url));
      }
    }
  }

  return NextResponse.next()
}