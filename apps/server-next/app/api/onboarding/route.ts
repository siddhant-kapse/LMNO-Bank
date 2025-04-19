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
        user: {
          connect: {
            username: user.username, // this sets up the relation properly
          }
        },
        customerId: 1000 + Math.floor(Math.random() * 9000), // Random customer ID
        firstName: validated.firstName,
        lastName: validated.lastName,
        phoneNumber: validated.phoneNumber,
        address: validated.address,
        pan: validated.pan,
        aadharNo: validated.aadharNo,
        balance: validated.balance || 100,
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

