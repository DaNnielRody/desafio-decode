import { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/authenticate';
import { UserController } from '../controllers/userController';

export const userRoutes = (fastify: FastifyInstance, userController: UserController) => {
  fastify.addHook('preHandler', authenticate);

  fastify.post('/', {
    handler: userController.create.bind(UserController),
  });

  fastify.get('/', {
    handler: userController.get.bind(UserController),
  });

  fastify.patch('/:id', {
    handler: userController.update.bind(UserController),
  });
};
