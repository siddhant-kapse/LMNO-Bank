// app/api/onboarding/route.ts
import { NextResponse } from 'next/server';
import { authenticate } from '../middleware'; // wherever you keep the auth
import prisma from 'prisma-client';
import { CustomerSchema } from 'common';

export async function POST(req: Request) {
  const user = await authenticate();
  if (user instanceof NextResponse) return user;

  try {
    const body = await req.json();
    const validated = CustomerSchema.parse(body);

    const customer = await prisma.customer.create({
      data: {
        userId: user.id,
        customerId: 1000 + Math.floor(Math.random() * 9000), // Random customer ID
        ...validated,
        // accounts: {
        //   create: { balance: 10000.0}
        // }
      },
      include: { accounts: true }
    });

    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating customer', error },
      { status: 400 }
    );
  }
}

