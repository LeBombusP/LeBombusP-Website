import { getUserData, signJWT } from '@/lib/auth';
import { jsonS } from '@/lib/utils';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import type { NextRequest } from 'next/server';

export default async function POST(req: NextRequest) {
  const { username, email, password, repeat } = await req.json();
  //add imput validation, pass = repeat (password)
  const prisma = new PrismaClient();
  await prisma.user
    .findFirst({
      where: {
        OR: {
          name: username,
          email: email,
        },
      },
    })
    .then((user) => {
      if (user) {
        return new Response(jsonS({ error: 'Username or email is taken' }), { status: 409 });
      }
    })
    .catch((error) => {
      console.error(error);
      return new Response(jsonS({ error: 'Server error' }), { status: 500 });
    });

  const hashed = bcrypt.hashSync(password, 10);

  try {
    await prisma.user.create({
      data: {
        name: username,
        email,
        password: hashed,
        permissions: 1,
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
  const jwt = await signJWT(process.env.JWT_KEY, '1d', id, name, mail);

  return new Response(jsonS({ jwt, time: 1 }), { status: 200 });
};
