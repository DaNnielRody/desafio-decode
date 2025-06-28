import { CreateUserDTO } from './createUserDTO';
import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().max(100).optional(),
  password: z.string().min(6).max(255).optional(),
});

export interface UpdateUserDTO extends Partial<CreateUserDTO> {}
