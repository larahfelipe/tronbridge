import type { GeneratedAccount } from 'tronweb';

import { AccountMessages } from '@/config';
import { ApplicationError } from '@/errors';
import type { TronWebService } from '@/services';

export class CreateAccountUseCase {
  private static INSTANCE: CreateAccountUseCase;
  private readonly tronWebService: TronWebService;

  private constructor(tronWebService: TronWebService) {
    this.tronWebService = tronWebService;
  }

  static getInstance(tronWebService: TronWebService) {
    if (
      !CreateAccountUseCase.INSTANCE ||
      CreateAccountUseCase.INSTANCE.tronWebService !== tronWebService
    )
      CreateAccountUseCase.INSTANCE = new CreateAccountUseCase(tronWebService);

    return CreateAccountUseCase.INSTANCE;
  }

  async create() {
    const newAccount = await this.tronWebService.createAccount();

    if (!newAccount?.privateKey?.length)
      throw new ApplicationError(AccountMessages.CREATION_EXCEPTION);

    const res: CreateAccountUseCase.Result = {
      account: newAccount,
      message: AccountMessages.CREATED
    };

    return res;
  }
}

namespace CreateAccountUseCase {
  export type Result = {
    account: GeneratedAccount;
    message: string;
  };
}
