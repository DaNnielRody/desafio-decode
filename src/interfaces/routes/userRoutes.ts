import { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/authenticate';
import { UserController } from '../controllers/userController';

export const userRoutes = (fastify: FastifyInstance, userController: UserController) => {
  fastify.addHook('preHandler', authenticate);

  fastify.post('/', {
    handler: userController.create.bind(userController),
  });

  fastify.get('/', {
    handler: userController.get.bind(userController),
  });

  fastify.patch('/', {
    handler: userController.update.bind(userController),
  });
};
