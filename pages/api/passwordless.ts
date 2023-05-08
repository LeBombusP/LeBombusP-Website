import { getUserData, signJWT } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import * as sendgrid from '@sendgrid/mail';
import 'dotenv/config';
import type { NextApiRequest, NextApiResponse } from 'next';

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
      return res.status(401).json({ error: 'Invalid email' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }

  const { id, name, mail } = await getUserData(email);
  const jwt = await signJWT(process.env.JWT_KEY, '1d', id, name, mail);

  sendgrid.setApiKey(process.env.EMAIL_KEY as string);
  const msg = {
    to: email,
    from: 'noreply@lebombusp.com', // Use the email address or domain you verified above
    subject: 'Passwordless login',
    text: 'login link to lebombusp.com',
    html: `<strong>Click below to login</strong><br>
    <a href="${process.env.ENV === 'DEV' ? 'http://localhost:3000' : 'https://lebombusp.com'}/jwt/${jwt}">Login</a><br>
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
