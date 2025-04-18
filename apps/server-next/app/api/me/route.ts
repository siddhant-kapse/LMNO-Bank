// app/api/me/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ username: null }, { status: 401 });

    const decoded = jwt.verify(token, SECRET) as { username: string };
    return NextResponse.json({ username: decoded.username });
  } catch (err) {
    return NextResponse.json({ username: null }, { status: 401 });
  }
}
