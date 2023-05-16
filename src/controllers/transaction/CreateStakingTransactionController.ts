import type { FastifyReply, FastifyRequest } from 'fastify';

import { DefaultErrorMessages } from '@/config';
import type { ApplicationError } from '@/errors';
import type { Controller } from '@/interfaces';
import type { CreateStakingTransactionUseCase } from '@/use-cases/transaction';
import { validate } from '@/validation';
import {
  CreateStakingTransactionSchema,
  type CreateStakingTransactionSchemaType
} from '@/validation/schema';

export class CreateStakingTransactionController implements Controller {
  private static INSTANCE: CreateStakingTransactionController;
  private readonly createStakingTransactionUseCase: CreateStakingTransactionUseCase;

  private constructor(
    createStakingTransactionUseCase: CreateStakingTransactionUseCase
  ) {
    this.createStakingTransactionUseCase = createStakingTransactionUseCase;
  }

  static getInstance(
    createStakingTransactionUseCase: CreateStakingTransactionUseCase
  ) {
    if (
      !CreateStakingTransactionController.INSTANCE ||
      CreateStakingTransactionController.INSTANCE
        .createStakingTransactionUseCase !== createStakingTransactionUseCase
    )
      CreateStakingTransactionController.INSTANCE =
        new CreateStakingTransactionController(createStakingTransactionUseCase);

    return CreateStakingTransactionController.INSTANCE;
  }

  async handle(
    req: CreateStakingTransactionController.Request,
    res: CreateStakingTransactionController.Response
  ) {
    try {
      const params = await validate(CreateStakingTransactionSchema, req.body);

      const result = await this.createStakingTransactionUseCase.create(params);

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

namespace CreateStakingTransactionController {
  export type Request = FastifyRequest<{
    Body: CreateStakingTransactionSchemaType;
  }>;
  export type Response = FastifyReply;
}
