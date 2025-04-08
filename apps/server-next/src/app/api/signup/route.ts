// app/api/signup/route.ts
import { NextResponse } from 'next/server';
import { UserSchema } from 'common';
import jwt from 'jsonwebtoken';
import prisma from 'prisma-client';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const validated = UserSchema.parse({ username, password });

    const existing = await prisma.user.findUnique({
      where: { username: validated.username }
    });

    if (existing) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    await prisma.user.create({
      data: {
        username: validated.username,
        password: validated.password // Consider hashing in production
      }
    });

    return NextResponse.json(
      { message: 'User created' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Server error',
        error: error instanceof Error ? error.message : 'Unknown'
      },
      { status: 500 }
    );
  }
}
