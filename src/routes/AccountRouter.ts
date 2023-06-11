import type { FastifyInstance, FastifyPluginOptions } from 'fastify';

import { Networks } from '@/config';
import {
  createAccountControllerHandler,
  getAccountControllerHandler,
  recoverAccountFromMnemonicsControllerHandler
} from '@/controllers/account';
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
    Object.values(Networks).forEach((network) => {
      fastify.get(`/${network}`, getAccountControllerHandler);
      fastify.post(`/${network}/create`, createAccountControllerHandler);
      fastify.post(
        `/${network}/recover`,
        recoverAccountFromMnemonicsControllerHandler
      );
    });

    done();
  }
}
