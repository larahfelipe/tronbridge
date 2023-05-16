import type { FastifyReply, FastifyRequest } from 'fastify';

import { DefaultErrorMessages } from '@/config';
import type { ApplicationError } from '@/errors';
import type { Controller } from '@/interfaces';
import type { GetAccountUseCase } from '@/use-cases/account';
import { validate } from '@/validation';
import {
  GetAccountSchema,
  type GetAccountSchemaType
} from '@/validation/schema';

export class GetAccountController implements Controller {
  private static INSTANCE: GetAccountController;
  private readonly getAccountUseCase: GetAccountUseCase;

  private constructor(getAccountUseCase: GetAccountUseCase) {
    this.getAccountUseCase = getAccountUseCase;
  }

  static getInstance(getAccountUseCase: GetAccountUseCase) {
    if (
      !GetAccountController.INSTANCE ||
      GetAccountController.INSTANCE.getAccountUseCase !== getAccountUseCase
    )
      GetAccountController.INSTANCE = new GetAccountController(
        getAccountUseCase
      );

    return GetAccountController.INSTANCE;
  }

  async handle(
    req: GetAccountController.Request,
    res: GetAccountController.Response
  ) {
    try {
      const params = await validate(GetAccountSchema, req.query);

      const result = await this.getAccountUseCase.get(params);

      return res.status(200).send(result);
    } catch (e) {
      const {
        statusCode = 500,
        name = 'InternalServerError',
        message = DefaultErrorMessages.INTERNAL_SERVER_ERROR
      } = e as ApplicationError;

      return res.status(statusCode).send({ name, message, originalError: e });
    }
  }
}

export namespace GetAccountController {
  export type Request = FastifyRequest<{
    Querystring: GetAccountSchemaType;
  }>;
  export type Response = FastifyReply;
}
