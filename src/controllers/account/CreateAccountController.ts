import type { FastifyReply, FastifyRequest } from 'fastify';

import { DefaultErrorMessages } from '@/config';
import type { ApplicationError } from '@/errors';
import type { Controller } from '@/interfaces';
import type { CreateAccountUseCase } from '@/use-cases/account';

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
    _: CreateAccountController.Request,
    res: CreateAccountController.Response
  ) {
    try {
      const result = await this.createAccountUseCase.create();

      return res.status(201).send(result);
    } catch (e) {
      const {
        statusCode = 500,
        name = 'InternalServerError',
        message = DefaultErrorMessages.INTERNAL_SERVER_ERROR
      } = e as ApplicationError;

      return res.status(statusCode).send({ name, message });
    }
  }
}

namespace CreateAccountController {
  export type Request = FastifyRequest;
  export type Response = FastifyReply;
}
