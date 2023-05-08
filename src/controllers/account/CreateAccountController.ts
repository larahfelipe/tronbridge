import type { FastifyReply, FastifyRequest } from 'fastify';

import type { ApplicationError } from '@/errors';
import type { Controller } from '@/interfaces';
import type { CreateAccountUseCase } from '@/use-cases/account';
import { CreateAccountSchema, validate } from '@/validation';

export class CreateAccountController implements Controller {
  private static INSTANCE: CreateAccountController;
  private readonly createAccountUseCase: CreateAccountUseCase;

  private constructor(createAccountUseCase: CreateAccountUseCase) {
    this.createAccountUseCase = createAccountUseCase;
  }

  static getInstance(createAccountUseCase: CreateAccountUseCase) {
    if (!CreateAccountController.INSTANCE)
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
      const { network } = await validate(CreateAccountSchema, req.query);

      const result = await this.createAccountUseCase.execute({ network });

      return res.status(201).send(result);
    } catch (e) {
      const { statusCode, name, message } = e as ApplicationError;

      return res.status(statusCode).send({ name, message });
    }
  }
}

namespace CreateAccountController {
  export type Request = FastifyRequest<{
    Querystring: Record<'network', string>;
  }>;
  export type Response = FastifyReply;
}
