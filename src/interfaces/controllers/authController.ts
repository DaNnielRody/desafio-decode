import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { AuthUseCase } from '@/application/use-cases/authUseCase';
import { CreateUserUseCase } from '@/application/use-cases/createUserUseCase';
import { LoginDTO, loginSchema } from '@/application/dto/loginDTO';
import { CreateUserDTO, createUserSchema } from '@/application/dto/createUserDTO';

export class AuthController {
  constructor(
    private readonly authUseCase: AuthUseCase,
    private readonly createUserUseCase: CreateUserUseCase
  ) {}

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const validatedData = loginSchema.parse(request.body);

      const loginDTO: LoginDTO = {
        email: validatedData.email,
        password: validatedData.password,
      };

      const user = await this.authUseCase.execute(loginDTO);

      const token = await reply.jwtSign({
        userId: user.id,
        email: user.email,
      });

      return reply.status(200).send({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user: {
            name: user.name,
            email: user.email,
          },
          token,
        },
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

  async register(request: FastifyRequest, reply: FastifyReply) {
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
        message: 'Usuário registrado com sucesso',
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
