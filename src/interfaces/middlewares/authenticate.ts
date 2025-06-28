import { FastifyReply, FastifyRequest } from 'fastify';
import { JWTPayload } from '../../types';
import { FastifyJWT } from '@fastify/jwt';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const decoded = await request.jwtVerify<JWTPayload>();
    request.user = decoded;
  } catch (error) {
    reply.status(401).send({ message: 'Unauthorized' });
  }
};
