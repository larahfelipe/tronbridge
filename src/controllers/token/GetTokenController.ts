import type { FastifyReply, FastifyRequest } from 'fastify';

import { DefaultErrorMessages } from '@/config';
import type { ApplicationError } from '@/errors';
import type { Controller } from '@/interfaces';
import type { GetTokenUseCase } from '@/use-cases/token';
import { validate } from '@/validation';
import { GetTokenSchema, type GetTokenSchemaType } from '@/validation/schema';

export class GetTokenController implements Controller {
  private static INSTANCE: GetTokenController;
  private readonly getTokenUseCase: GetTokenUseCase;

  private constructor(getTokenUseCase: GetTokenUseCase) {
    this.getTokenUseCase = getTokenUseCase;
  }

  static getInstance(getTokenUseCase: GetTokenUseCase) {
    if (
      !GetTokenController.INSTANCE ||
      GetTokenController.INSTANCE.getTokenUseCase !== getTokenUseCase
    )
      GetTokenController.INSTANCE = new GetTokenController(getTokenUseCase);

    return GetTokenController.INSTANCE;
  }

  async handle(
    req: GetTokenController.Request,
    res: GetTokenController.Response
  ) {
    try {
      const params = await validate(GetTokenSchema, req.query);

      const result = await this.getTokenUseCase.get(params);

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

export namespace GetTokenController {
  export type Request = FastifyRequest<{
    Querystring: GetTokenSchemaType;
  }>;
  export type Response = FastifyReply;
}
