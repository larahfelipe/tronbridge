import type { FastifyReply, FastifyRequest } from 'fastify';

import { DefaultErrorMessages } from '@/config';
import type { ApplicationError } from '@/errors';
import type { Controller } from '@/interfaces';
import type { CreateTransactionUseCase } from '@/use-cases/transaction';
import { validate } from '@/validation';
import {
  CreateTransactionSchema,
  type CreateTransactionSchemaType
} from '@/validation/schema';

export class CreateTransactionController implements Controller {
  private static INSTANCE: CreateTransactionController;
  private readonly createTransactionUseCase: CreateTransactionUseCase;

  private constructor(createTransactionUseCase: CreateTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase;
  }

  static getInstance(createTransactionUseCase: CreateTransactionUseCase) {
    if (
      !CreateTransactionController.INSTANCE ||
      CreateTransactionController.INSTANCE.createTransactionUseCase !==
        createTransactionUseCase
    )
      CreateTransactionController.INSTANCE = new CreateTransactionController(
        createTransactionUseCase
      );

    return CreateTransactionController.INSTANCE;
  }

  async handle(
    req: CreateTransactionController.Request,
    res: CreateTransactionController.Response
  ) {
    try {
      const params = await validate(CreateTransactionSchema, req.body);

      const result = await this.createTransactionUseCase.create(params);

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

namespace CreateTransactionController {
  export type Request = FastifyRequest<{
    Body: CreateTransactionSchemaType;
  }>;
  export type Response = FastifyReply;
}
