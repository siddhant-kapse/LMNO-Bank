import { NextResponse } from 'next/server';
import { authenticate } from '../middleware';
import prisma from 'prisma-client';
import { CustomerSchema } from 'common';

export async function POST(req: Request) {
  const user = await authenticate(req);
  if (user instanceof NextResponse) return user;

  try {
    const body = await req.json();
    const validated = CustomerSchema.parse(body);

    // Create customer with auto-incremented ID
    const customer = await prisma.customer.create({
      data: {
        user: { connect: { id: user.id } },
        ...validated,
        accounts: {
          create: { balance: 10000.0 }
        }
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