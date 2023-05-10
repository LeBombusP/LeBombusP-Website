import { verifyJWT } from '@/lib/auth';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  if (process.env.ENV != "DEV") {
    return new Response(JSON.stringify({ message: "Not Found" }), { status: 404 });
  }
  
  const data = await req.json();
  const cookies = await req.cookies.get('jwt');
  console.log(cookies)

  const damn = await verifyJWT(process.env.JWT_KEY, "example jwt key")
  console.log(damn?.verified)
  console.log(damn?.user)

  return new Response(JSON.stringify({ text: "Hello" }), { status: 200 });
}