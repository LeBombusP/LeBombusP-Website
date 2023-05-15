import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';
 
export async function middleware(request: NextRequest) {
  //if dashbord and no jwt -> login
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    console.log("attemting to get to dashboard");
    let cookie = request.cookies.get('jwt')?.value;
    if (!cookie) {
      console.log("no cookie (dashboard)");
      return NextResponse.rewrite(new URL('/login', request.url));
    }
    const auth = await verifyJWT(process.env.JWT_KEY,cookie);
    if (!auth?.verified) {
      console.log("wrong jwt (dashboard)");
      return NextResponse.rewrite(new URL('/login', request.url));
    }
    console.log("working (dashboard)");

  }
  //if login and jwt -> dashboard
  if (request.nextUrl.pathname.startsWith('/login')||request.nextUrl.pathname.startsWith('/signup')) {
    console.log("attemting to get to login");
    let cookie = request.cookies.get('jwt')?.value;
    if (cookie) {
      console.log("got cookie (login)");
      const auth = await verifyJWT(process.env.JWT_KEY,cookie);
      if (auth?.verified) {
        console.log("found jwt -> dashboard (login)");
        return NextResponse.rewrite(new URL('/dashboard', request.url));
      }
      console.log("wrong jwt (login)");
    }
    console.log("no cookie (login)");
  }

  return NextResponse.next()
}