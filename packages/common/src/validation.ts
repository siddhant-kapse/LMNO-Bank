// packages/common/src/lib/validation.ts
import { z } from "zod";

export const UserSchema = z.object({
  username: z.string().email(),
  password: z.string().min(8)
});

// JWT
export const JwtPayloadSchema = z.object({
  userId: z.string(),
  username: z.string().email(),
  role: z.enum(["user", "admin"]).default("user"),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export const CustomerSchema = z.object({
  firstName: z.string().max(100),
  lastName: z.string().max(100),
  phoneNumber: z.string().min(10),
  address: z.string(),
  pan: z.string().regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/),
  aadharNo: z.string().length(12)
});

export const AccountSchema = z.object({
  balance: z.number().positive()
});

export const TransactionSchema = z.object({
  transactionType: z.enum(["DEPOSIT", "WITHDRAWAL", "TRANSFER"]),
  amount: z.number().positive(),
  description: z.string().max(255).optional()
});