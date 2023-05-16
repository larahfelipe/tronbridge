import type { FastifyReply, FastifyRequest } from 'fastify';

import { DefaultErrorMessages } from '@/config';
import type { ApplicationError } from '@/errors';
import type { Controller } from '@/interfaces';
import type { GetTransactionUseCase } from '@/use-cases/transaction';
import { validate } from '@/validation';
import {
  GetTransactionSchema,
  type GetTransactionSchemaType
} from '@/validation/schema';

export class GetTransactionController implements Controller {
  private static INSTANCE: GetTransactionController;
  private readonly getTransactionUseCase: GetTransactionUseCase;

  private constructor(getTransactionUseCase: GetTransactionUseCase) {
    this.getTransactionUseCase = getTransactionUseCase;
  }

  static getInstance(getTransactionUseCase: GetTransactionUseCase) {
    if (
      !GetTransactionController.INSTANCE ||
      GetTransactionController.INSTANCE.getTransactionUseCase !==
        getTransactionUseCase
    )
      GetTransactionController.INSTANCE = new GetTransactionController(
        getTransactionUseCase
      );

    return GetTransactionController.INSTANCE;
  }

  async handle(
    req: GetTransactionController.Request,
    res: GetTransactionController.Response
  ) {
    try {
      const params = await validate(GetTransactionSchema, req.query);

      const result = await this.getTransactionUseCase.get(params);

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

namespace GetTransactionController {
  export type Request = FastifyRequest<{
    Querystring: GetTransactionSchemaType;
  }>;
  export type Response = FastifyReply;
}
