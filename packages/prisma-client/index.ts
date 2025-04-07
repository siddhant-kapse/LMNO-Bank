import { PrismaClient } from '@prisma/client';

// Initialize Prisma
const prisma = new PrismaClient();

// MongoDB connection URL (will use DATABASE_URL from environment)
export default prisma;

// Utility for connecting/disconnecting (optional)
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected');
  } catch (error) {
    console.error('Connection error', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await prisma.$connect();
};