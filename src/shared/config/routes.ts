import { FastifyInstance } from 'fastify';
import { DataSource } from 'typeorm';

import { User } from '@/domain/entities/User';
import { Task } from '@/domain/entities/Task';

import { UserRepository, IUserRepository } from '@/infrastructure/repositories/userRepository';
import { TaskRepository, ITaskRepository } from '@/infrastructure/repositories/taskRepository';

import { CryptoProvider } from '@/infrastructure/providers/cryptoProvider';

import { AuthUseCase } from '@/application/use-cases/authUseCase';
import { CreateUserUseCase } from '@/application/use-cases/createUserUseCase';
import { CreateTaskUseCase } from '@/application/use-cases/createTaskUseCase';
import { UserRepositoryValidationUseCase } from '@/application/use-cases/userRepositoryValidationUseCase';
import { TaskRepositoryValidationUseCase } from '@/application/use-cases/taskRepositoryValidationUseCase';

import { AuthController } from '@/interfaces/controllers/authController';
import { UserController } from '@/interfaces/controllers/userController';
import { TaskController } from '@/interfaces/controllers/taskController';

import { authRoutes } from '@/interfaces/routes/authRoutes';
import { userRoutes } from '@/interfaces/routes/userRoutes';
import { taskRoutes } from '@/interfaces/routes/taskRoutes';

export async function setupRoutes(server: FastifyInstance) {
  const dataSource: DataSource = server.orm;

  const userRepository: IUserRepository = new UserRepository(dataSource.getRepository(User));
  const taskRepository: ITaskRepository = new TaskRepository(dataSource.getRepository(Task));

  const cryptoProvider = new CryptoProvider();

  const userRepositoryValidationUseCase = new UserRepositoryValidationUseCase(userRepository);
  const taskRepositoryValidationUseCase = new TaskRepositoryValidationUseCase(taskRepository);

  const authUseCase = new AuthUseCase(
    userRepository,
    userRepositoryValidationUseCase,
    cryptoProvider
  );
  const createUserUseCase = new CreateUserUseCase(
    userRepositoryValidationUseCase,
    userRepository,
    cryptoProvider
  );
  const createTaskUseCase = new CreateTaskUseCase(userRepositoryValidationUseCase, taskRepository);

  const authController = new AuthController(authUseCase, createUserUseCase);
  const userController = new UserController(
    createUserUseCase,
    userRepository,
    userRepositoryValidationUseCase,
    cryptoProvider
  );
  const taskController = new TaskController(
    createTaskUseCase,
    taskRepository,
    userRepository,
    taskRepositoryValidationUseCase,
    userRepositoryValidationUseCase
  );

  await server.register(
    async function (fastify) {
      await authRoutes(fastify, authController);
    },
    { prefix: '/auth' }
  );

  await server.register(
    async function (fastify) {
      userRoutes(fastify, userController);
    },
    { prefix: '/users' }
  );

  await server.register(
    async function (fastify) {
      taskRoutes(fastify, taskController);
    },
    { prefix: '/tasks' }
  );
}
