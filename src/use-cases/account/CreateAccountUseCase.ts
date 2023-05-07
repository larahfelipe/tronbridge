import type { Account } from 'tronweb';

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
      case 'mainnet':
        newTrxAccount = await this.tronWebService.mainnet.createAccount();
        break;
      case 'testnet':
        newTrxAccount = await this.tronWebService.testnet.createAccount();
        break;
      default:
        throw new Error('Invalid network provided');
    }

    if (!newTrxAccount?.privateKey)
      throw new Error('Something went wrong while generating a new account');

    const res: CreateAccountUseCase.Result = {
      account: {
        network,
        ...newTrxAccount
      },
      message: 'Account created successfully'
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
