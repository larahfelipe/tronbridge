import type { FastifyReply, FastifyRequest } from 'fastify';

import { DefaultErrorMessages } from '@/config';
import type { ApplicationError } from '@/errors';
import type { Controller } from '@/interfaces';
import type { CreateAccountUseCase } from '@/use-cases/account';
import { validate } from '@/validation';
import {
  CreateAccountSchema,
  type CreateAccountSchemaType
} from '@/validation/schema';

export class CreateAccountController implements Controller {
  private static INSTANCE: CreateAccountController;
  private readonly createAccountUseCase: CreateAccountUseCase;

  private constructor(createAccountUseCase: CreateAccountUseCase) {
    this.createAccountUseCase = createAccountUseCase;
  }

  static getInstance(createAccountUseCase: CreateAccountUseCase) {
    if (
      !CreateAccountController.INSTANCE ||
      CreateAccountController.INSTANCE.createAccountUseCase !==
        createAccountUseCase
    )
      CreateAccountController.INSTANCE = new CreateAccountController(
        createAccountUseCase
      );

    return CreateAccountController.INSTANCE;
  }

  async handle(
    req: CreateAccountController.Request,
    res: CreateAccountController.Response
  ) {
    try {
      const params = await validate(CreateAccountSchema, req.query);

      const result = await this.createAccountUseCase.create(params);

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

namespace CreateAccountController {
  export type Request = FastifyRequest<{
    Querystring: CreateAccountSchemaType;
  }>;
  export type Response = FastifyReply;
}
