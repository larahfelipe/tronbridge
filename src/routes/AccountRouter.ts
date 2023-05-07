import type { FastifyInstance, FastifyPluginOptions } from 'fastify';

import { createAccountControllerHandler } from '@/controllers/account';
import type { Router } from '@/interfaces';

export class AccountRouter implements Router {
  endpointUri: string;

  constructor() {
    this.endpointUri = '/v1/account';
  }

  async routes(
    fastify: FastifyInstance,
    _: FastifyPluginOptions,
    done: () => unknown
  ) {
    fastify.post('/', createAccountControllerHandler);
    done();
  }
}
