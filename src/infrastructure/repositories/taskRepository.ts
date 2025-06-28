import { CreateTaskDTO } from '@/application/dto/createTaskDTO';
import { UpdateTaskDTO } from '@/application/dto/updateTaskDTO';
import { GetTaskFiltersDTO } from '@/application/dto/getTaskDTO';
import { Task } from '@/domain/entities/Task';
import { Repository } from 'typeorm';

export interface ITaskRepository {
  create(task: CreateTaskDTO): Promise<Task>;
  findAll(): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  findWithFilters(filters: GetTaskFiltersDTO): Promise<Task[]>;
  update(id: string, task: UpdateTaskDTO): Promise<Task | null>;
  delete(id: string): Promise<void>;
}

export class TaskRepository implements ITaskRepository {
  constructor(private readonly repository: Repository<Task>) {}

  async create(task: CreateTaskDTO): Promise<Task> {
    const taskData = {
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
      priority: task.priority,
      assigneeUser: task.assigneeUser,
    };
    const newTask = this.repository.create(taskData);
    return await this.repository.save(newTask);
  }

  async findAll(): Promise<Task[]> {
    return await this.repository.find({ relations: ['assigneeUser'] });
  }

  async findById(id: string): Promise<Task | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['assigneeUser'],
    });
  }

  async findWithFilters(filters: GetTaskFiltersDTO): Promise<Task[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assigneeUser', 'user');

    if (filters.userId) {
      queryBuilder.andWhere('user.id = :userId', { userId: filters.userId });
    }

    if (filters.status !== undefined) {
      queryBuilder.andWhere('task.status = :status', { status: filters.status });
    }

    return await queryBuilder.getMany();
  }

  async update(id: string, task: UpdateTaskDTO): Promise<Task | null> {
    const updateData: any = {};

    if (task.title !== undefined) updateData.title = task.title;
    if (task.description !== undefined) updateData.description = task.description;
    if (task.status !== undefined) updateData.status = task.status;
    if (task.dueDate !== undefined) updateData.dueDate = task.dueDate;
    if (task.priority !== undefined) updateData.priority = task.priority;
    if (task.assigneeUser !== undefined) updateData.assigneeUser = task.assigneeUser;

    await this.repository.update(id, updateData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
