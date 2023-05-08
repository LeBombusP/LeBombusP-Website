import { getUserData, signJWT } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password, remember } = req.body;

  if (req.method !== 'POST') {
    return res.status(404).json({ error: 'Not found' });
  }
  if (!!username || !!password) {
    return res.status(400).json({ error: 'Missing username or password' });
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
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }

  const { id, name, mail } = await getUserData(username);
  const jwt = await signJWT(process.env.JWT_KEY, remember, id, name, mail);
  return res.status(200).json({ jwt, time: remember ? 30 : 1 });
};
