import { ITaskRepository } from '@/infrastructure/repositories/taskRepository';

export class TaskRepositoryValidationUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async validateTaskAssignee(taskId: string, userId: string): Promise<void> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    if (task.assigneeUser.id !== userId) {
      throw new Error('User is not the assignee of the task');
    }
  }

  async validateTaskExists(taskId: string): Promise<void> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }
  }
}
