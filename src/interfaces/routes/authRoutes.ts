import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/authController';

export async function authRoutes(fastify: FastifyInstance, authController: AuthController) {
  fastify.post('/login', {
    handler: authController.login.bind(authController),
  });

  fastify.post('/register', {
    handler: authController.register.bind(authController),
  });
}
