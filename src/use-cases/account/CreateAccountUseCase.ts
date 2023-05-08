import type { Account } from 'tronweb';

import { AccountMessages, DefaultErrorMessages, Network } from '@/config';
import { ApplicationError } from '@/errors';
import type { TronWebService } from '@/services';

export class CreateAccountUseCase {
  private static INSTANCE: CreateAccountUseCase;
  private readonly tronWebService: TronWebService;

  private constructor(tronWebService: TronWebService) {
    this.tronWebService = tronWebService;
  }

  static getInstance(tronWebService: TronWebService) {
    if (!CreateAccountUseCase.INSTANCE)
      CreateAccountUseCase.INSTANCE = new CreateAccountUseCase(tronWebService);

    return CreateAccountUseCase.INSTANCE;
  }

  async execute(params: CreateAccountUseCase.Params) {
    const { network } = params;

    let newTrxAccount: Account | null;

    switch (network) {
      case Network.MAINNET:
        newTrxAccount = await this.tronWebService.mainnet.createAccount();
        break;
      case Network.TESTNET:
        newTrxAccount = await this.tronWebService.testnet.createAccount();
        break;
      default:
        throw new ApplicationError(DefaultErrorMessages.UNCAUGHT_EXCEPTION);
    }

    if (!newTrxAccount?.privateKey)
      throw new ApplicationError(AccountMessages.CREATION_EXCEPTION);

    const res: CreateAccountUseCase.Result = {
      account: {
        ...newTrxAccount,
        network
      },
      message: AccountMessages.CREATED
    };

    return res;
  }
}

namespace CreateAccountUseCase {
  export type Params = Record<'network', string>;
  export type Result = {
    account: Account & Record<'network', string>;
    message: string;
  };
}
