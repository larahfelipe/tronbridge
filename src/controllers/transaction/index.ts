import type { FastifyReply, FastifyRequest } from 'fastify';

import { Networks } from '@/config';
import { TronGridService, TronWebService } from '@/services';
import {
  CreateStakeTransactionUseCase,
  CreateTransferTransactionUseCase,
  GetTransactionUseCase
} from '@/use-cases/transaction';
import type {
  CreateStakeTransactionSchemaType,
  CreateTransferTransactionSchemaType,
  GetTransactionSchemaType
} from '@/validation/schema';

import { CreateStakeTransactionController } from './CreateStakeTransactionController';
import { CreateTransferTransactionController } from './CreateTransferTransactionController';
import { GetTransactionController } from './GetTransactionController';

export const createStakeTransactionControllerHandler = (
  req: FastifyRequest<{ Body: CreateStakeTransactionSchemaType }>,
  res: FastifyReply
) => {
  const targetNetwork = req.routerPath.includes(Networks.MAINNET)
    ? Networks.MAINNET
    : Networks.TESTNET;

  const tronWebService = TronWebService.getInstance(targetNetwork);

  const createStakeTransactionUseCase =
    CreateStakeTransactionUseCase.getInstance(tronWebService);

  const createStakeTransactionController =
    CreateStakeTransactionController.getInstance(createStakeTransactionUseCase);

  return createStakeTransactionController.handle(req, res);
};

export const createTransferTransactionControllerHandler = (
  req: FastifyRequest<{ Body: CreateTransferTransactionSchemaType }>,
  res: FastifyReply
) => {
  const targetNetwork = req.routerPath.includes(Networks.MAINNET)
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
  const targetNetwork = req.routerPath.includes(Networks.MAINNET)
    ? Networks.MAINNET
    : Networks.TESTNET;

  const tronWebService = TronWebService.getInstance(targetNetwork);
  const tronGridService = TronGridService.getInstance(targetNetwork);

  const getTransactionUseCase = GetTransactionUseCase.getInstance(
    tronWebService,
    tronGridService
  );

  const getTransactionController = GetTransactionController.getInstance(
    getTransactionUseCase
  );

  return getTransactionController.handle(req, res);
};
