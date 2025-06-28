import { User } from '@/domain/entities/User';
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().optional(),
  status: z.boolean().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.string().optional(),
  assigneeUserId: z.string().uuid(),
});

export interface CreateTaskDTO {
  title: string;
  description?: string;
  status?: string;
  dueDate?: Date;
  priority?: string;
  assigneeUser: User;
}
