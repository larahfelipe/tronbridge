import type { FastifyInstance, FastifyPluginOptions } from 'fastify';

export interface Router {
  endpointUri: string;
  routes: (
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    done: () => unknown
  ) => void;
}
