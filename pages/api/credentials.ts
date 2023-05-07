/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import * as jose from 'jose';
import 'dotenv/config';

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
    if (error.message == 'NotFoundError' || error.code == 'P2025') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
  const jwt = await new jose.SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setSubject('urn:example:subject')
    .setExpirationTime('2h')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  return res.status(200).json({ jwt });
};
