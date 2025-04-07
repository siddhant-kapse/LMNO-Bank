// apps/server-next/src/services/auth.ts
import jwt from 'jsonwebtoken';
import { prisma } from '../../prisma-client';
import { UserSchema } from '@common/src';

const SECRET = process.env.JWT_SECRET!;

export class AuthService {
  static async signup(username: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) throw new Error('User already exists');
    
    return prisma.user.create({ 
      data: { username, password } // In production, hash password first
    });
  }

  static async login(username: string, password: string) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }
    
    return jwt.sign(
      { username: user.username, id: user.id },
      SECRET,
      { expiresIn: '1h' }
    );
  }

  static verifyToken(token: string) {
    return jwt.verify(token, SECRET) as { username: string; id: string };
  }
}