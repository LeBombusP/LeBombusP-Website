import { getUserData, signJWT, validateInputs } from '@/lib/auth';
import { jsonS } from '@/lib/utils';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { username, email, password, repeat } = await req.json();

  // Input validation
  const inputs = validateInputs({ username, email, password, repeatPassword: repeat });
  if (!inputs.email || !inputs.username || !inputs.password || !inputs.passwordRegister) {
    return new Response(jsonS({ error: 'Invalid input' }), { status: 400 });
  }

  try {
    const prisma = new PrismaClient();
    await prisma.user.findFirstOrThrow({
      where: {
        OR: [
          {
            name: username,
          },
          {
            email: email,
          },
        ],
      },
    });
    return new Response(jsonS({ error: 'Username or email is taken' }), { status: 409 });
  } catch (error) {
    // Error P2025 means that the account was not found, so in this case we can continue
    if (error.code != 'P2025') {
      console.log(error);
      return new Response(jsonS({ error: 'Server error' }), { status: 500 });
    }
  }

  // Create user with newly hashed password
  const hashed = bcrypt.hashSync(password, 10);
  try {
    const prisma = new PrismaClient();
    await prisma.user.create({
      data: {
        name: username,
        email,
        password: hashed,
        permissions: 1,
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(jsonS({ error: 'Server error' }), { status: 500 });
  }

  //Get user data abd store it in jwt
  const { id, name, mail, error, perms } = await getUserData(username);
  if (error) {
    return new Response(jsonS({ error }), { status: 500 });
  }
  const jwt = await signJWT(process.env.JWT_KEY, '1d', id, name, mail, perms);
  return new Response(jsonS({ jwt, time: 1 }), { status: 200 });
}
 