import type { FastifyReply, FastifyRequest } from 'fastify';

import { Networks } from '@/config';
import { TronWebService } from '@/services';
import {
  CreateStakingTransactionUseCase,
  CreateTransferTransactionUseCase,
  GetTransactionUseCase
} from '@/use-cases/transaction';
import type {
  CreateStakingTransactionSchemaType,
  CreateTransferTransactionSchemaType,
  GetTransactionSchemaType
} from '@/validation/schema';

import { CreateStakingTransactionController } from './CreateStakingTransactionController';
import { CreateTransferTransactionController } from './CreateTransferTransactionController';
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

export const createTransferTransactionControllerHandler = (
  req: FastifyRequest<{ Body: CreateTransferTransactionSchemaType }>,
  res: FastifyReply
) => {
  const targetNetwork = req.routerPath.endsWith(Networks.MAINNET)
    ? Networks.MAINNET
    : Networks.TESTNET;

  const tronWebService = TronWebService.getInstance(targetNetwork);

  const createTransferTransactionUseCase =
    CreateTransferTransactionUseCase.getInstance(tronWebService);

  const createTransferTransactionController =
    CreateTransferTransactionController.getInstance(
      createTransferTransactionUseCase
    );

  return createTransferTransactionController.handle(req, res);
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
