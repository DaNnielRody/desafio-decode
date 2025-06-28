import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(100),
  password: z.string().min(6).max(255),
});

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}
