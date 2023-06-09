import type { FastifyReply, FastifyRequest } from 'fastify';

import { Networks } from '@/config';
import { TronGridService, TronWebService } from '@/services';
import {
  CreateAccountUseCase,
  GetAccountUseCase,
  RecoverAccountFromMnemonicsUseCase
} from '@/use-cases/account';
import type {
  CreateAccountSchemaType,
  GetAccountSchemaType,
  RecoverAccountFromMnemonicsSchemaType
} from '@/validation/schema';

import { CreateAccountController } from './CreateAccountController';
import { GetAccountController } from './GetAccountController';
import { RecoverAccountFromMnemonicsController } from './RecoverAccountFromMnemonicsController';

export const createAccountControllerHandler = (
  req: FastifyRequest<{ Querystring: CreateAccountSchemaType }>,
  res: FastifyReply
) => {
  const targetNetwork = req.routerPath.includes(Networks.MAINNET)
    ? Networks.MAINNET
    : Networks.SHASTA;

  const tronWebService = TronWebService.getInstance(targetNetwork);

  const createAccountUseCase = CreateAccountUseCase.getInstance(tronWebService);

  const createAccountController =
    CreateAccountController.getInstance(createAccountUseCase);

  return createAccountController.handle(req, res);
};

export const getAccountControllerHandler = (
  req: FastifyRequest<{ Querystring: GetAccountSchemaType }>,
  res: FastifyReply
) => {
  const targetNetwork = req.routerPath.includes(Networks.MAINNET)
    ? Networks.MAINNET
    : Networks.SHASTA;

  const tronGridService = TronGridService.getInstance(targetNetwork);
  const tronWebService = TronWebService.getInstance(targetNetwork);

  const getAccountUseCase = GetAccountUseCase.getInstance(
    tronGridService,
    tronWebService
  );

  const getAccountController =
    GetAccountController.getInstance(getAccountUseCase);

  return getAccountController.handle(req, res);
};

export const recoverAccountFromMnemonicsControllerHandler = (
  req: FastifyRequest<{ Body: RecoverAccountFromMnemonicsSchemaType }>,
  res: FastifyReply
) => {
  const targetNetwork = req.routerPath.includes(Networks.MAINNET)
    ? Networks.MAINNET
    : Networks.SHASTA;

  const tronWebService = TronWebService.getInstance(targetNetwork);

  const recoverAccountFromMnemonicsUseCase =
    RecoverAccountFromMnemonicsUseCase.getInstance(tronWebService);

  const recoverAccountFromMnemonicsController =
    RecoverAccountFromMnemonicsController.getInstance(
      recoverAccountFromMnemonicsUseCase
    );

  return recoverAccountFromMnemonicsController.handle(req, res);
};
