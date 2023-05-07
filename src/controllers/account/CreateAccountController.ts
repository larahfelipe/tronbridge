import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import type { Controller } from '@/interfaces';
import type { CreateAccountUseCase } from '@/use-cases/account';

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
      const { network } = req.query as { network: string };

      if (!network?.length) throw new Error('Parameter network is required');

      const result = await this.createAccountUseCase.execute({ network });

      return res.status(201).send(result);
    } catch (e) {
      const { message } = e as FastifyError;

      return res.status(500).send(message);
    }
  }
}

namespace CreateAccountController {
  export type Request = FastifyRequest;
  export type Response = FastifyReply;
}
