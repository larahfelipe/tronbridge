import type { FastifyReply, FastifyRequest } from 'fastify';

import { Networks } from '@/config';
import { TronGridService, TronWebService } from '@/services';
import { GetTokenUseCase } from '@/use-cases/token';
import type { GetTokenSchemaType } from '@/validation/schema';

import { GetTokenController } from './GetTokenController';

export const getTokenControllerHandler = (
  req: FastifyRequest<{ Querystring: GetTokenSchemaType }>,
  res: FastifyReply
) => {
  const targetNetwork = req.routerPath.includes(Networks.MAINNET)
    ? Networks.MAINNET
    : Networks.SHASTA;

  const tronGridService = TronGridService.getInstance(targetNetwork);
  const tronWebService = TronWebService.getInstance(targetNetwork);

  const getTokenUseCase = GetTokenUseCase.getInstance(
    tronGridService,
    tronWebService
  );

  const getTokenController = GetTokenController.getInstance(getTokenUseCase);

  return getTokenController.handle(req, res);
};
