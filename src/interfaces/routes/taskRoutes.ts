import { FastifyInstance } from 'fastify';
import { TaskController } from '../controllers/taskController';
import { authenticate } from '../middlewares/authenticate';

export const taskRoutes = (fastify: FastifyInstance, taskController: TaskController) => {
  fastify.addHook('preHandler', authenticate);

  fastify.post('/', {
    handler: taskController.create.bind(taskController),
  });

  fastify.get('/', {
    handler: taskController.getAll.bind(taskController),
  });

  fastify.patch('/:id', {
    handler: taskController.update.bind(taskController),
  });

  fastify.delete('/:id', {
    handler: taskController.delete.bind(taskController),
  });
};
