import { getUserData, signJWT, validateInputs } from '@/lib/auth';
import { jsonS } from '@/lib/utils';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import type { NextRequest } from 'next/server';

export default async function POST(req: NextRequest) {
  const { username, password, remember } = await req.json();
  
  const imputs = validateInputs({ username, password })
  if (!imputs.username || !imputs.password) {
    return new Response(jsonS({ error: 'Invalid inputs' }), { status: 400 });
  }

  const hashed = bcrypt.hashSync(password, 10);
  try {
    const prisma = new PrismaClient();
    await prisma.user.findFirstOrThrow({
      where: {
        name: username,
        password: hashed,
      },
    });
  } catch (error) {
    if (error.message == 'NotFoundError' || error.code == 'P2025') {
      return new Response(jsonS({ error: 'Invalid credentials' }), { status: 401 });
    }
    console.error(error);
    return new Response(jsonS({ error: 'Server error' }), { status: 500 });
  }

  const { id, name, mail } = await getUserData(username);
  const jwt = await signJWT(process.env.JWT_KEY, remember, id, name, mail);
  return new Response(jsonS({ jwt, time: remember ? 30 : 1 }), { status: 200 });
};
