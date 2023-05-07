import type { FastifyReply, FastifyRequest } from 'fastify';

export interface Controller {
  handle: (req: FastifyRequest, res: FastifyReply) => Promise<unknown>;
}
