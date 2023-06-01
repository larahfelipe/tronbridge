import type { FastifyReply, FastifyRequest } from 'fastify';

import { DefaultErrorMessages } from '@/config';
import type { ApplicationError } from '@/errors';
import type { Controller } from '@/interfaces';
import type { GetAllTransactionsUseCase } from '@/use-cases/transaction';
import { validate } from '@/validation';
import {
  GetAllTransactionsSchema,
  type GetAllTransactionsSchemaType
} from '@/validation/schema';

export class GetAllTransactionsController implements Controller {
  private static INSTANCE: GetAllTransactionsController;
  private readonly getAllTransactionsUseCase: GetAllTransactionsUseCase;

  private constructor(getAllTransactionsUseCase: GetAllTransactionsUseCase) {
    this.getAllTransactionsUseCase = getAllTransactionsUseCase;
  }

  static getInstance(getAllTransactionsUseCase: GetAllTransactionsUseCase) {
    if (
      !GetAllTransactionsController.INSTANCE ||
      GetAllTransactionsController.INSTANCE.getAllTransactionsUseCase !==
        getAllTransactionsUseCase
    )
      GetAllTransactionsController.INSTANCE = new GetAllTransactionsController(
        getAllTransactionsUseCase
      );

    return GetAllTransactionsController.INSTANCE;
  }

  async handle(
    req: GetAllTransactionsController.Request,
    res: GetAllTransactionsController.Response
  ) {
    try {
      const params = await validate(GetAllTransactionsSchema, req.query);

      const result = await this.getAllTransactionsUseCase.get(params);

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

namespace GetAllTransactionsController {
  export type Request = FastifyRequest<{
    Querystring: GetAllTransactionsSchemaType;
  }>;
  export type Response = FastifyReply;
}
