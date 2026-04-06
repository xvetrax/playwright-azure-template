import { z } from 'zod';

export const LoginRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const LoginResponseSchema = z.object({
  token: z.string().min(1),
});

export const HealthResponseSchema = z.object({
  endpoint: z.string().min(1),
  statusCode: z.number().int().nonnegative(),
  ok: z.boolean(),
  checkedAt: z.string().min(1),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
