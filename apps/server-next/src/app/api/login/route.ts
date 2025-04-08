// app/api/login/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from 'prisma-client';
import { UserSchema } from 'common';

const SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const validated = UserSchema.parse({ username, password });

    const user = await prisma.user.findUnique({
      where: { username: validated.username }
    });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign({ username: user.username }, SECRET, {
      expiresIn: '1h',
    });

    const response = NextResponse.json({ message: 'Login successful' });

    // 🍪 Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
