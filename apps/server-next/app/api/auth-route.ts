import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma  from 'prisma-client';
import {  UserSchema } from "common";

const SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    
    // Handle Login
    if (req.url.includes('/login')) {
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

      const token = jwt.sign(
        { username: user.username },
        SECRET,
        { expiresIn: '1h' }
      );

      return NextResponse.json({ token });
    }

    // Handle Signup
    if (req.url.includes('/signup')) {
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
        data: { username: validated.username, password: validated.password }
      });

      return NextResponse.json(
        { message: 'User created' },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { message: 'Not found' },
      { status: 404 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}