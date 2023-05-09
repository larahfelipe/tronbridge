import type { FastifyReply, FastifyRequest } from 'fastify';

import { Networks } from '@/config';
import { TronWebService } from '@/services';
import { CreateTransactionUseCase } from '@/use-cases/transaction';
import type { CreateTransactionSchemaType } from '@/validation/schema';

import { CreateTransactionController } from './CreateTransactionController';

export const createTransactionControllerHandler = (
  req: FastifyRequest<{ Body: CreateTransactionSchemaType }>,
  res: FastifyReply
) => {
  const targetNetwork = req.routerPath.endsWith(Networks.MAINNET)
    ? Networks.MAINNET
    : Networks.TESTNET;

  const tronWebService = TronWebService.getInstance(targetNetwork);

  const createTransactionUseCase =
    CreateTransactionUseCase.getInstance(tronWebService);

  const createTransactionController = CreateTransactionController.getInstance(
    createTransactionUseCase
  );

  return createTransactionController.handle(req, res);
};
