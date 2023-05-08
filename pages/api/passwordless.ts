/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import * as jose from 'jose';
import 'dotenv/config';
import * as sendgrid from '@sendgrid/mail';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;

  if (req.method !== 'POST') {
    return res.status(404).json({ error: 'Not found' });
  }
  if (!!email) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  try {
    const prisma = new PrismaClient();
    await prisma.user.findFirstOrThrow({
      where: {
        email,
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
    .setExpirationTime('8h')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  sendgrid.setApiKey(process.env.EMAIL_KEY as string);
  const msg = {
    to: email,
    from: 'noreply@lebombusp.com', // Use the email address or domain you verified above
    subject: 'Passwordless login',
    text: 'login link to lebombusp.com',
    html: `<strong>Click below to login</strong><br>
    <a href="${process.env.ENV === 'DEV' ? 'http://localhost:3000' : 'https://lebombusp.com'}/auth/jwt/${jwt}">Login</a><br>
    <p>This link will expire in 8 hours</p><br>
    <p>Not you? Do NOT click the link and just ingore the email</p>`,
  };
  sendgrid.send(msg).then(
    () => {
      console.log('Email sent');
      return res.status(200).json({ message: 'Email sent' });
    },
    (error) => {
      console.log(error);
      if (error.response) {
        console.log(error.response.body);
      }
      return res.status(500).json({ error: 'Server error' });
    }
  );
};
