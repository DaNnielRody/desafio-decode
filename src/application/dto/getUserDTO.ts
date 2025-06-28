import { z } from 'zod';

export const getUserSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(100),
  email: z.string().email().max(100),
});

export interface getUserDTO {
  id: string;
  name: string;
  email: string;
}
