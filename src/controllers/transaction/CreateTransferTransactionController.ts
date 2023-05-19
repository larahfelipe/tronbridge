import type { FastifyReply, FastifyRequest } from 'fastify';

import { DefaultErrorMessages } from '@/config';
import type { ApplicationError } from '@/errors';
import type { Controller } from '@/interfaces';
import type { CreateTransferTransactionUseCase } from '@/use-cases/transaction';
import { validate } from '@/validation';
import {
  CreateTransferTransactionSchema,
  type CreateTransferTransactionSchemaType
} from '@/validation/schema';

export class CreateTransferTransactionController implements Controller {
  private static INSTANCE: CreateTransferTransactionController;
  private readonly createTransferTransactionUseCase: CreateTransferTransactionUseCase;

  private constructor(
    createTransferTransactionUseCase: CreateTransferTransactionUseCase
  ) {
    this.createTransferTransactionUseCase = createTransferTransactionUseCase;
  }

  static getInstance(
    createTransferTransactionUseCase: CreateTransferTransactionUseCase
  ) {
    if (
      !CreateTransferTransactionController.INSTANCE ||
      CreateTransferTransactionController.INSTANCE
        .createTransferTransactionUseCase !== createTransferTransactionUseCase
    )
      CreateTransferTransactionController.INSTANCE =
        new CreateTransferTransactionController(
          createTransferTransactionUseCase
        );

    return CreateTransferTransactionController.INSTANCE;
  }

  async handle(
    req: CreateTransferTransactionController.Request,
    res: CreateTransferTransactionController.Response
  ) {
    try {
      const params = await validate(CreateTransferTransactionSchema, req.body);

      const result = await this.createTransferTransactionUseCase.create(params);

      return res.status(201).send(result);
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

namespace CreateTransferTransactionController {
  export type Request = FastifyRequest<{
    Body: CreateTransferTransactionSchemaType;
  }>;
  export type Response = FastifyReply;
}
