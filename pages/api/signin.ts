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
};
