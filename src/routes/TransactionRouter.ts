import type { FastifyInstance, FastifyPluginOptions } from 'fastify';

import { Networks } from '@/config';
import {
  createStakingTransactionControllerHandler,
  createTransferTransactionControllerHandler,
  getTransactionControllerHandler
} from '@/controllers/transaction';
import type { Router } from '@/interfaces';

export class TransactionRouter implements Router {
  endpointUri: string;

  constructor() {
    this.endpointUri = '/v1/transaction';
  }

  async routes(
    fastify: FastifyInstance,
    _: FastifyPluginOptions,
    done: () => unknown
  ) {
    Object.values(Networks).forEach((network) => {
      fastify.get(`/${network}`, getTransactionControllerHandler);
      fastify.post(
        `/${network}/transfer`,
        createTransferTransactionControllerHandler
      );
      fastify.post(
        `/${network}/staking`,
        createStakingTransactionControllerHandler
      );
    });

    done();
  }
}
