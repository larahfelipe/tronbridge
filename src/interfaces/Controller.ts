import type { FastifyReply, FastifyRequest } from 'fastify';

export interface Controller {
  handle: (req: FastifyRequest<any>, res: FastifyReply) => Promise<unknown>;
}
