import Fastify from 'fastify';
import { bootstrap } from '@/shared/config/db';
import { setupRoutes } from '@/shared/config/routes';
import '@/shared/config/env';

const server = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true },
    },
  },
  pluginTimeout: 0,
});

const start = async () => {
  try {
    await server.register(require('@fastify/jwt'), {
      secret: process.env.JWT_SECRET,
    });

    await bootstrap(server);

    await server.after();

    await setupRoutes(server);

    server.get('/ping', async () => {
      return { pong: 'it worked!' };
    });

    await server.listen({ port: Number(process.env.PORT), host: '0.0.0.0' });

    const address = server.server.address();
    const port = typeof address === 'string' ? address : address?.port;

    server.log.info(`Server is running on port ${port}`);
    server.log.info('GET /ping - Health check');
    server.log.info('POST /auth/login - User login');
    server.log.info('POST /auth/register - User registration');
    server.log.info('POST /users - Create user');
    server.log.info('GET /users - Get user profile');
    server.log.info('PATCH /users/:id - Update user');
    server.log.info('POST /tasks - Create task');
    server.log.info('GET /tasks - Get tasks');
    server.log.info('PATCH /tasks/:id - Update task');
    server.log.info('DELETE /tasks/:id - Delete task');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
