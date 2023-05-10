import { PrismaClient } from '@prisma/client';
import { SignJWT, jwtVerify } from 'jose';
import { nanoid } from 'nanoid';
import { z } from 'zod';

export async function signJWT(key: string | undefined, expieres: string | boolean, id: string, username: string, email: string, perms: number) {
  if (typeof expieres == 'boolean') {
    expieres = expieres ? '30d' : '1d';
  }

  return await new SignJWT({ id, username, email, perms })
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime(expieres)
    .sign(new TextEncoder().encode(key));
}

export async function verifyJWT(key: string | undefined, token: string) {
  if (!key) {
    return {
      verified: false
    }
  }

  try {
    const value = await jwtVerify(token, new TextEncoder().encode(key));
    if (value.payload.exp && value.payload.exp > Date.now() / 1000) {
      return {
        verified: true,
        user: {
          id: value.payload.id,
          username: value.payload.username,
          email: value.payload.email,
          perms: value.payload.perms,
        }
      }
    } 
  } catch (error) {
    return {
      verified: false
    }
  }
}

export async function getUserData(info: string) {
  const prisma = new PrismaClient();
  let user;
  try {
    user = await prisma.user.findFirstOrThrow({
      where: {
        OR: [
          {
            name: info,
          },
          {
            email: info,
          },
        ],
      },
    });
  } catch (error) {
    if (error.code == 'P2025') {
      return { error: 'Database error' };
    }
    console.log(error);
    return { error: 'Server error' };
  }
  console.log(user);
  return { id: user.id, name: user.name, mail: user.email, perms: user.permissions };
}

interface Inputs {
  username?: string;
  email?: string;
  password?: string;
  repeatPassword?: string;
}
interface ReturnInputs {
  username: boolean;
  email: boolean;
  password?: boolean;
  passwordRegister?: boolean;
}

export function validateInputs(inputs: Inputs) {
  let returnInputs: ReturnInputs = {
    username: false,
    email: false,
    password: false,
  };

  try {
    const userSchema = z.object({
      username: z
        .string()
        .min(5)
        .max(16)
        .regex(/^[a-zA-Z0-9-]+$/),
    });
    userSchema.parse({ username: inputs.username });

    returnInputs = {
      username: true,
      email: returnInputs.email,
      password: returnInputs.password,
    };
  } catch (error) {
    console.log(error);
  }

  try {
    const emailSchema = z.object({
      email: z.string().email(),
    });
    emailSchema.parse({ email: inputs.email });

    returnInputs = {
      username: returnInputs.username,
      email: true,
      password: returnInputs.password,
    };
  } catch (error) {
    console.log(error);
  }

  try {
    const passwordSchema = z.object({
      password: z.string().min(8).max(32),
    });
    passwordSchema.parse({ password: inputs.password });

    returnInputs = {
      username: returnInputs.username,
      email: returnInputs.email,
      password: true,
      passwordRegister: false,
    };
    if (inputs.password === inputs.repeatPassword) {
      returnInputs = {
        username: returnInputs.username,
        email: returnInputs.email,
        password: true,
        passwordRegister: true,
      };
    }
  } catch (error) {
    console.log(error);
  }
  return returnInputs;
}
