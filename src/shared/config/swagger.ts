export const swaggerConfig = {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      description:
        'API REST para gerenciamento de tarefas desenvolvida com TypeScript, Bun e Fastify',
      version: '1.0.0',
    },
  },
};

export const swaggerUiConfig = {
  routePrefix: '/docs',
};
