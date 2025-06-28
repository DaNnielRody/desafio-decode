import { ITaskRepository } from '@/infrastructure/repositories/taskRepository';
import { CreateTaskDTO } from '../dto/createTaskDTO';
import { Task } from '@/domain/entities/Task';
import { UserRepositoryValidationUseCase } from './userRepositoryValidationUseCase';
import { TaskRepositoryValidationUseCase } from './taskRepositoryValidationUseCase';

export class CreateTaskUseCase {
  constructor(
    private readonly userRepositoryValidationUseCase: UserRepositoryValidationUseCase,
    private readonly taskRepositoryValidationUseCase: TaskRepositoryValidationUseCase,
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(task: CreateTaskDTO): Promise<Task> {
    await this.userRepositoryValidationUseCase.validateUserExists(task.assigneeUser.id);

    await this.taskRepositoryValidationUseCase.validateTaskExists(task.assigneeUser.id);

    return await this.taskRepository.create({
      ...task,
      assigneeUser: task.assigneeUser,
    });
  }
}
