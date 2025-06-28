import { FastifyInstance } from 'fastify';
import dbConnection from 'typeorm-fastify-plugin';
import { DataSource } from 'typeorm';
import { User } from '@/domain/entities/User';
import { Task } from '@/domain/entities/Task';
import { Socket } from 'net';

async function waitForDb(host: string, port: number) {
  const maxAttempts = 10;
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      await new Promise<void>((resolve, reject) => {
        const sock = new Socket();
        sock
          .once('error', () => {
            sock.destroy();
            reject(new Error('not ready'));
          })
          .once('connect', () => {
            sock.end();
            resolve();
          })
          .connect(port, host);
      });
      console.log('DB pronto');
      return;
    } catch {
      console.log(
        `DB não pronto em ${host}:${port}, tentando novamente em 2s (${i}/${maxAttempts})`
      );
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error(`Não conseguiu conectar ao DB em ${host}:${port} após várias tentativas.`);
}

export async function bootstrap(server: FastifyInstance) {
  const host = process.env.DB_HOST!;
  const port = Number(process.env.DB_PORT);
  await waitForDb(host, port);

  const dataSource = new DataSource({
    type: 'postgres',
    host,
    port,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    dropSchema: true,
    entities: [User, Task],
  });

  await server.register(dbConnection, { connection: dataSource });
}
