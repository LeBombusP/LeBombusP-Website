/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password } = req.body;

  if (req.method !== 'POST') {
    return res.status(404).json({ error: 'Not found' });
  }
  if (!!username || !!password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }
  try {
    const prisma = new PrismaClient();
    await prisma.user.findFirstOrThrow({
      where: {
        name: username,
        password,
      },
    });
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return res.status(401).json({ error: 'Wrong username or password' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
  return res.status(200);
};
