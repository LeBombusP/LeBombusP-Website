import { getUserData, signJWT, validateInputs } from '@/lib/auth';
import { jsonS } from '@/lib/utils';
import { PrismaClient } from '@prisma/client';
import * as sendgrid from '@sendgrid/mail';
import 'dotenv/config';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const imputs = validateInputs({ email });
  if (!imputs.email) {
    return new Response(jsonS({ error: 'Invalid input' }), { status: 400 });
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
      return new Response(jsonS({ error: 'Invalid email' }), { status: 401 });
    }
    console.error(error);
    return new Response(jsonS({ error: 'Server error' }), { status: 500 });
  }

  const { id, name, mail, perms } = await getUserData(email);
  const jwt = await signJWT(process.env.JWT_KEY, '1d', id, name, mail, perms);

  sendgrid.setApiKey(process.env.EMAIL_KEY as string);
  const msg = {
    to: email,
    from: 'noreply@lebombusp.com',
    subject: 'Passwordless login',
    text: 'login link to lebombusp.com',
    html: `<strong>Click below to login</strong><br>
    <a href="${process.env.ENV === 'DEV' ? 'http://localhost:3000' : 'https://lebombusp.com'}/login/jwt/${jwt}">Login</a><br>
    <p>This link will expire in 8 hours</p><br>
    <p>Not you? Do NOT click the link and just ingore the email</p>`,
  };
  sendgrid.send(msg).then(
    () => {
      return new Response(jsonS({ message: 'Email sent' }), { status: 200 });
    },
    (error) => {
      console.log(error);
      if (error.response) {
        console.log(error.response.body);
      }
      return new Response(jsonS({ error: 'Server error' }), { status: 500 });
    }
  );
}
