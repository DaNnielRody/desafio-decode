import { z } from 'zod';

export interface getTaskDTO {
  id: string;
  title: string;
}

export interface GetTaskFiltersDTO {
  userId?: string;
  status?: boolean;
}

export const getTaskFiltersSchema = z.object({
  userId: z.string().uuid().optional(),
  status: z.coerce.boolean().optional(),
});
