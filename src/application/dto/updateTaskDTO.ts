import { CreateTaskDTO } from './createTaskDTO';
import { z } from 'zod';

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  description: z.string().optional(),
  status: z.boolean().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.string().optional(),
  assigneeUserId: z.string().uuid().optional(),
});

export interface UpdateTaskDTO extends Partial<CreateTaskDTO> {}
