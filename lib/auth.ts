import { PrismaClient } from '@prisma/client';
import { SignJWT, jwtVerify } from 'jose';
import { nanoid } from 'nanoid';

export async function signJWT(key: string | undefined, expieres: string | boolean, id: string, username: string, email: string) {
  if (typeof expieres == 'boolean') {
    expieres = expieres ? '30d' : '1d';
  }

  return await new SignJWT({ id, username, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime(expieres)
    .sign(new TextEncoder().encode(key));
}

export async function verifyJWT(key: string | undefined, token: string) {
  return await jwtVerify(token, new TextEncoder().encode(key));
}

export async function getUserData(info: string) {
  const prisma = new PrismaClient();
  let user;
  try {
    user = await prisma.user.findFirst({
      where: {
        OR: {
          name: info,
          email: info,
        },
      },
    });
  } catch (error) {
    if (error.message == 'NotFoundError' || error.code == 'P2025') {
      return { error: 'User not found' };
    }
    console.error(error);
    return { error: 'Server error' };
  }
  return { id: user.id, name: user.name, mail: user.email };
}
