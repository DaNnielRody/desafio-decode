import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { CreateUserUseCase } from '@/application/use-cases/createUserUseCase';
import { CreateUserDTO, createUserSchema } from '@/application/dto/createUserDTO';
import { UpdateUserDTO, updateUserSchema } from '@/application/dto/updateUserDTO';
import { IUserRepository } from '@/infrastructure/repositories/userRepository';
import { UserRepositoryValidationUseCase } from '@/application/use-cases/userRepositoryValidationUseCase';
import { CryptoProvider } from '@/infrastructure/providers/cryptoProvider';

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly userRepository: IUserRepository,
    private readonly userRepositoryValidationUseCase: UserRepositoryValidationUseCase,
    private readonly cryptoProvider: CryptoProvider
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const validatedData = createUserSchema.parse(request.body);

      const createUserDTO: CreateUserDTO = {
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
      };

      const user = await this.createUserUseCase.execute(createUserDTO);

      const { password, ...userWithoutPassword } = user;

      return reply.status(201).send({
        success: true,
        message: 'Usuário criado com sucesso',
        data: userWithoutPassword,
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

  async get(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request as any).user.userId;

      const user = await this.userRepository.findById(userId);

      if (!user) {
        return reply.status(404).send({
          success: false,
          message: 'Usuário não encontrado',
        });
      }

      const { password, ...userWithoutPassword } = user;

      return reply.status(200).send({
        success: true,
        data: userWithoutPassword,
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        message: error.message || 'Erro interno do servidor',
      });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request as any).user.userId;
      const validatedData = updateUserSchema.parse(request.body);

      await this.userRepositoryValidationUseCase.validateUserExists(userId);

      const updateUserDTO: UpdateUserDTO = {};

      if (validatedData.name !== undefined) {
        updateUserDTO.name = validatedData.name;
      }

      if (validatedData.email !== undefined) {
        const existingUser = await this.userRepository.findByEmail(validatedData.email);
        if (existingUser && existingUser.id !== userId) {
          return reply.status(400).send({
            success: false,
            message: 'Email já está sendo usado por outro usuário',
          });
        }
        updateUserDTO.email = validatedData.email;
      }

      if (validatedData.password !== undefined) {
        updateUserDTO.password = await this.cryptoProvider.hash(validatedData.password);
      }

      const updatedUser = await this.userRepository.update(userId, updateUserDTO);

      if (!updatedUser) {
        return reply.status(404).send({
          success: false,
          message: 'Usuário não encontrado',
        });
      }

      const { password, ...userWithoutPassword } = updatedUser;

      return reply.status(200).send({
        success: true,
        message: 'Usuário atualizado com sucesso',
        data: userWithoutPassword,
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
