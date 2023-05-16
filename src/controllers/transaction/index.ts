import type { FastifyReply, FastifyRequest } from 'fastify';

import { Networks } from '@/config';
import { TronWebService } from '@/services';
import {
  CreateStakingTransactionUseCase,
  CreateTransactionUseCase,
  GetTransactionUseCase
} from '@/use-cases/transaction';
import type {
  CreateStakingTransactionSchemaType,
  CreateTransactionSchemaType,
  GetTransactionSchemaType
} from '@/validation/schema';

import { CreateStakingTransactionController } from './CreateStakingTransactionController';
import { CreateTransactionController } from './CreateTransactionController';
import { GetTransactionController } from './GetTransactionController';

export const createStakingTransactionControllerHandler = (
  req: FastifyRequest<{ Body: CreateStakingTransactionSchemaType }>,
  res: FastifyReply
) => {
  const targetNetwork = req.routerPath.endsWith(Networks.MAINNET)
    ? Networks.MAINNET
    : Networks.TESTNET;

  const tronWebService = TronWebService.getInstance(targetNetwork);

  const createStakingTransactionUseCase =
    CreateStakingTransactionUseCase.getInstance(tronWebService);

  const createStakingTransactionController =
    CreateStakingTransactionController.getInstance(
      createStakingTransactionUseCase
    );

  return createStakingTransactionController.handle(req, res);
};

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

export const getTransactionControllerHandler = (
  req: FastifyRequest<{ Querystring: GetTransactionSchemaType }>,
  res: FastifyReply
) => {
  const targetNetwork = req.routerPath.endsWith(Networks.MAINNET)
    ? Networks.MAINNET
    : Networks.TESTNET;

  const tronWebService = TronWebService.getInstance(targetNetwork);

  const getTransactionUseCase =
    GetTransactionUseCase.getInstance(tronWebService);

  const getTransactionController = GetTransactionController.getInstance(
    getTransactionUseCase
  );

  return getTransactionController.handle(req, res);
};
