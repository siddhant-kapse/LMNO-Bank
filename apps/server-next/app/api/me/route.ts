// app/api/me/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from 'prisma-client';

const SECRET = process.env.JWT_SECRET!;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const payload = jwt.verify(token, SECRET) as { username: string };
    const user = await prisma.user.findUnique({
      where: { username: payload.username },
      include: { customers: true }, // Get related customers
    });


    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

     // Check if the user has any customers
     if (user.customers.length === 0) {
      return NextResponse.json({
        username: user.username,
        hasCustomer: false,
        balance: null,
      });
    }

    return NextResponse.json({
      username: user.username,
      hasCustomer: user.customers.length > 0,
      balance: user.customers[0].balance ?? null,
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ message: 'Error', error: err }), { status: 500 });
  }
}