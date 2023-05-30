import type { FastifyReply, FastifyRequest } from 'fastify';

import { DefaultErrorMessages } from '@/config';
import type { ApplicationError } from '@/errors';
import type { Controller } from '@/interfaces';
import type { CreateStakeTransactionUseCase } from '@/use-cases/transaction';
import { validate } from '@/validation';
import {
  CreateStakeTransactionSchema,
  type CreateStakeTransactionSchemaType
} from '@/validation/schema';

export class CreateStakeTransactionController implements Controller {
  private static INSTANCE: CreateStakeTransactionController;
  private readonly createStakeTransactionUseCase: CreateStakeTransactionUseCase;

  private constructor(
    createStakeTransactionUseCase: CreateStakeTransactionUseCase
  ) {
    this.createStakeTransactionUseCase = createStakeTransactionUseCase;
  }

  static getInstance(
    createStakeTransactionUseCase: CreateStakeTransactionUseCase
  ) {
    if (
      !CreateStakeTransactionController.INSTANCE ||
      CreateStakeTransactionController.INSTANCE
        .createStakeTransactionUseCase !== createStakeTransactionUseCase
    )
      CreateStakeTransactionController.INSTANCE =
        new CreateStakeTransactionController(createStakeTransactionUseCase);

    return CreateStakeTransactionController.INSTANCE;
  }

  async handle(
    req: CreateStakeTransactionController.Request,
    res: CreateStakeTransactionController.Response
  ) {
    try {
      const params = await validate(CreateStakeTransactionSchema, req.body);

      const result = await this.createStakeTransactionUseCase.create(params);

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

namespace CreateStakeTransactionController {
  export type Request = FastifyRequest<{
    Body: CreateStakeTransactionSchemaType;
  }>;
  export type Response = FastifyReply;
}
