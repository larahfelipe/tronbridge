import type { FastifyInstance, FastifyPluginOptions } from 'fastify';

import { Networks } from '@/config';
import { getTokenControllerHandler } from '@/controllers/token';
import type { Router } from '@/interfaces';

export class TokenRouter implements Router {
  endpointUri: string;

  constructor() {
    this.endpointUri = '/v1/token';
  }

  async routes(
    fastify: FastifyInstance,
    _: FastifyPluginOptions,
    done: () => unknown
  ) {
    Object.values(Networks).forEach((network) => {
      fastify.get(`/${network}`, getTokenControllerHandler);
    });

    done();
  }
}
