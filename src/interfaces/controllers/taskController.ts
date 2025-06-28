import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { CreateTaskUseCase } from '@/application/use-cases/createTaskUseCase';
import { CreateTaskDTO, createTaskSchema } from '@/application/dto/createTaskDTO';
import { UpdateTaskDTO, updateTaskSchema } from '@/application/dto/updateTaskDTO';
import { GetTaskFiltersDTO, getTaskFiltersSchema } from '@/application/dto/getTaskDTO';
import { ITaskRepository } from '@/infrastructure/repositories/taskRepository';
import { IUserRepository } from '@/infrastructure/repositories/userRepository';
import { TaskRepositoryValidationUseCase } from '@/application/use-cases/taskRepositoryValidationUseCase';
import { UserRepositoryValidationUseCase } from '@/application/use-cases/userRepositoryValidationUseCase';

const taskParamsSchema = z.object({
  id: z.string().uuid(),
});

export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly taskRepository: ITaskRepository,
    private readonly userRepository: IUserRepository,
    private readonly taskRepositoryValidationUseCase: TaskRepositoryValidationUseCase,
    private readonly userRepositoryValidationUseCase: UserRepositoryValidationUseCase
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const validatedData = createTaskSchema.parse(request.body);

      await this.userRepositoryValidationUseCase.validateUserExists(validatedData.assigneeUserId);
      const assigneeUser = await this.userRepository.findById(validatedData.assigneeUserId);

      const createTaskDTO: CreateTaskDTO = {
        title: validatedData.title,
        description: validatedData.description,
        status: validatedData.status,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
        priority: validatedData.priority,
        assigneeUser: assigneeUser!,
      };

      const task = await this.createTaskUseCase.execute(createTaskDTO);

      return reply.status(201).send({
        success: true,
        message: 'Tarefa criada com sucesso',
        data: task,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors,
        });
      }

      return reply.status(400).send({
        success: false,
        message: error.message || 'Erro interno do servidor',
      });
    }
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const currentUserId = (request as any).user.userId;

      const queryParams = getTaskFiltersSchema.parse(request.query);

      const filters: GetTaskFiltersDTO = {
        userId: queryParams.userId || currentUserId,
        status: queryParams.status,
      };

      const tasks = await this.taskRepository.findWithFilters(filters);

      return reply.status(200).send({
        success: true,
        data: tasks,
        total: tasks.length,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          message: 'Parâmetros de filtro inválidos',
          errors: error.errors,
        });
      }

      return reply.status(500).send({
        success: false,
        message: error.message || 'Erro interno do servidor',
      });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = taskParamsSchema.parse(request.params);
      const validatedData = updateTaskSchema.parse(request.body);
      const userId = (request as any).user.userId;

      await this.taskRepositoryValidationUseCase.validateTaskExists(id);

      const task = await this.taskRepository.findById(id);
      if (!task) {
        return reply.status(404).send({
          success: false,
          message: 'Tarefa não encontrada',
        });
      }

      if (task.assigneeUser.id !== userId) {
        return reply.status(403).send({
          success: false,
          message: 'Você não tem permissão para modificar esta tarefa',
        });
      }

      const updateTaskDTO: UpdateTaskDTO = {};

      if (validatedData.title) {
        updateTaskDTO.title = validatedData.title;
      }

      if (validatedData.description !== undefined) {
        updateTaskDTO.description = validatedData.description;
      }

      if (validatedData.status !== undefined) {
        updateTaskDTO.status = validatedData.status;
      }

      if (validatedData.dueDate) {
        updateTaskDTO.dueDate = new Date(validatedData.dueDate);
      }

      if (validatedData.priority !== undefined) {
        updateTaskDTO.priority = validatedData.priority;
      }

      if (validatedData.assigneeUserId) {
        await this.userRepositoryValidationUseCase.validateUserExists(validatedData.assigneeUserId);
        const assigneeUser = await this.userRepository.findById(validatedData.assigneeUserId);
        updateTaskDTO.assigneeUser = assigneeUser!;
      }

      const updatedTask = await this.taskRepository.update(id, updateTaskDTO);

      if (!updatedTask) {
        return reply.status(404).send({
          success: false,
          message: 'Tarefa não encontrada',
        });
      }

      return reply.status(200).send({
        success: true,
        message: 'Tarefa atualizada com sucesso',
        data: updatedTask,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors,
        });
      }

      return reply.status(400).send({
        success: false,
        message: error.message || 'Erro interno do servidor',
      });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = taskParamsSchema.parse(request.params);
      const userId = (request as any).user.userId;

      await this.taskRepositoryValidationUseCase.validateTaskExists(id);

      const task = await this.taskRepository.findById(id);
      if (!task) {
        return reply.status(404).send({
          success: false,
          message: 'Tarefa não encontrada',
        });
      }

      if (task.assigneeUser.id !== userId) {
        return reply.status(403).send({
          success: false,
          message: 'Você não tem permissão para deletar esta tarefa',
        });
      }

      await this.taskRepository.delete(id);

      return reply.status(200).send({
        success: true,
        message: 'Tarefa excluída com sucesso',
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors,
        });
      }

      return reply.status(400).send({
        success: false,
        message: error.message || 'Erro interno do servidor',
      });
    }
  }
}
