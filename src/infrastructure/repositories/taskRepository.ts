import { CreateTaskDTO } from '@/application/dto/createTaskDTO';
import { UpdateTaskDTO } from '@/application/dto/updateTaskDTO';
import { GetTaskFiltersDTO } from '@/application/dto/getTaskDTO';
import { Task } from '@/domain/entities/Task';

export interface ITaskRepository {
  create(task: CreateTaskDTO): Promise<Task>;
  findAll(): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  findWithFilters(filters: GetTaskFiltersDTO): Promise<Task[]>;
  update(id: string, task: UpdateTaskDTO): Promise<Task | null>;
  delete(id: string): Promise<void>;
}
