import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from 'prisma-client';

const SECRET = process.env.JWT_SECRET!;

export async function authenticate() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json(
      { message: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { username: string };
    const user = await prisma.user.findUnique({
      where: { username: decoded.username }
    });

    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 403 }
    );
  }
}
