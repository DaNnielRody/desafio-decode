import { ITaskRepository } from '@/infrastructure/repositories/taskRepository';
import { CreateTaskDTO } from '../dto/createTaskDTO';
import { Task } from '@/domain/entities/Task';
import { UserRepositoryValidationUseCase } from './userRepositoryValidationUseCase';

export class CreateTaskUseCase {
  constructor(
    private readonly userRepositoryValidationUseCase: UserRepositoryValidationUseCase,
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(task: CreateTaskDTO): Promise<Task> {
    await this.userRepositoryValidationUseCase.validateUserExists(task.assigneeUser.id);

    return await this.taskRepository.create({
      ...task,
      assigneeUser: task.assigneeUser,
    });
  }
}
