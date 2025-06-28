import Fastify from 'fastify';
import { bootstrap } from '@/shared/config/db';
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

    server.get('/ping', async () => {
      return { pong: 'it worked!' };
    });

    await server.listen({ port: Number(process.env.PORT), host: '0.0.0.0' });

    const address = server.server.address();
    const port = typeof address === 'string' ? address : address?.port;

    server.log.info(`Server is running on port ${port}`);
    server.log.info('GET /ping - Health check');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
