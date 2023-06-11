import type { FastifyReply, FastifyRequest } from 'fastify';

import { DefaultErrorMessages } from '@/config';
import type { ApplicationError } from '@/errors';
import type { Controller } from '@/interfaces';
import type { RecoverAccountFromMnemonicsUseCase } from '@/use-cases/account';
import { validate } from '@/validation';
import {
  RecoverAccountFromMnemonicsSchema,
  type RecoverAccountFromMnemonicsSchemaType
} from '@/validation/schema';

export class RecoverAccountFromMnemonicsController implements Controller {
  private static INSTANCE: RecoverAccountFromMnemonicsController;
  private readonly recoverAccountFromMnemonicsUseCase: RecoverAccountFromMnemonicsUseCase;

  private constructor(
    recoverAccountFromMnemonicsUseCase: RecoverAccountFromMnemonicsUseCase
  ) {
    this.recoverAccountFromMnemonicsUseCase =
      recoverAccountFromMnemonicsUseCase;
  }

  static getInstance(
    recoverAccountFromMnemonicsUseCase: RecoverAccountFromMnemonicsUseCase
  ) {
    if (
      !RecoverAccountFromMnemonicsController.INSTANCE ||
      RecoverAccountFromMnemonicsController.INSTANCE
        .recoverAccountFromMnemonicsUseCase !==
        recoverAccountFromMnemonicsUseCase
    )
      RecoverAccountFromMnemonicsController.INSTANCE =
        new RecoverAccountFromMnemonicsController(
          recoverAccountFromMnemonicsUseCase
        );

    return RecoverAccountFromMnemonicsController.INSTANCE;
  }

  async handle(
    req: RecoverAccountFromMnemonicsController.Request,
    res: RecoverAccountFromMnemonicsController.Response
  ) {
    try {
      const params = await validate(
        RecoverAccountFromMnemonicsSchema,
        req.body
      );

      const result = await this.recoverAccountFromMnemonicsUseCase.recover(
        params
      );

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

export namespace RecoverAccountFromMnemonicsController {
  export type Request = FastifyRequest<{
    Body: RecoverAccountFromMnemonicsSchemaType;
  }>;
  export type Response = FastifyReply;
}
