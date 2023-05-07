import type { FastifyReply, FastifyRequest } from 'fastify';

import { TronWebService } from '@/services';
import { CreateAccountUseCase } from '@/use-cases/account';

import { CreateAccountController } from './CreateAccountController';

export const createAccountControllerHandler = (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const tronWebService = TronWebService.getInstance();

  const createAccountUseCase = CreateAccountUseCase.getInstance(tronWebService);

  const createAccountController =
    CreateAccountController.getInstance(createAccountUseCase);

  return createAccountController.handle(req, res);
};
