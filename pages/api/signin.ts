/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { SignJWT } from 'jose';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import { nanoid } from 'nanoid';
import { getUserData, signJWT } from '@/lib/auth';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, email, password, repeat } = req.body;

  if (req.method !== 'POST') {
    return res.status(404).json({ error: 'Not found' });
  }
  //add imput validation, pass = repeat
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
        return res.status(409).json({ error: 'Username or email is taken' });
      }
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
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
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
  
  const { id, name, mail } = await getUserData(username)
  const jwt = await signJWT(process.env.JWT_KEY, "1d", id, name, mail)

  return res.status(200).json({ jwt, time: 1 });
  
};
