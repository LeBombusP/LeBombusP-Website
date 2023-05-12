import { getUserData, signJWT, validateInputs } from '@/lib/auth';
import { jsonS } from '@/lib/utils';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { username, password, remember } = await req.json();

  // Input validation
  const imputs = validateInputs({ username, password });
  if (!imputs.username || !imputs.password) {
    return new Response(jsonS({ error: 'Invalid inputs' }), { status: 400 });
  }

  try {
    const prisma = new PrismaClient();
    const user = await prisma.user.findFirstOrThrow({
      where: {
        name: username,
      },
    });
    // Wrong password
    if (!bcrypt.compareSync(password, user.password)) {
      return new Response(jsonS({ error: 'Invalid credentials' }), { status: 401 });
    }
  } catch (error) {
    // Wrong username
    if (error.message == 'NotFoundError' || error.code == 'P2025') {
      return new Response(jsonS({ error: 'Invalid credentials' }), { status: 401 });
    }
    // Unknown error
    console.error(error);
    return new Response(jsonS({ error: 'Server error' }), { status: 500 });
  }

  //Get user data abd store it in jwt
  const { id, name, mail, error, perms } = await getUserData(username);
  if (error) {
    return new Response(jsonS({ error }), { status: 500 });
  }
  const jwt = await signJWT(process.env.JWT_KEY, remember, id, name, mail, perms);
  return new Response(jsonS({ jwt, time: remember ? 30 : 1 }), { status: 200 });
}
