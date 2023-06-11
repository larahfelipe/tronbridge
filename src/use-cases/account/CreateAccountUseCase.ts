import { AccountMessages } from '@/config';
import type { GeneratedAccount } from '@/domain/models';
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

  async create({ with_mnemonics }: CreateAccountUseCase.Params) {
    const newAccount = with_mnemonics
      ? await this.tronWebService.createAccountWithMnemonics()
      : await this.tronWebService.createAccount();

    if (!newAccount?.privateKey?.length)
      throw new ApplicationError(AccountMessages.CREATION_EXCEPTION);

    const account: GeneratedAccount = {
      ...(newAccount as GeneratedAccount),
      ...(with_mnemonics
        ? {
            privateKey: newAccount.privateKey.slice(2).toUpperCase(),
            publicKey: newAccount.publicKey.slice(2).toUpperCase(),
            address: {
              base58: newAccount.address as string,
              hex: this.tronWebService.base58ToHex(newAccount.address as string)
            }
          }
        : {
            privateKey: newAccount.privateKey,
            publicKey: newAccount.publicKey,
            address: {
              base58: (newAccount.address as Record<'base58', string>).base58,
              hex: (newAccount.address as Record<'hex', string>).hex
            }
          })
    };

    const res: CreateAccountUseCase.Result = {
      account,
      message: AccountMessages.CREATED
    };

    return res;
  }
}

namespace CreateAccountUseCase {
  export type Params = {
    with_mnemonics?: boolean;
  };
  export type Result = {
    account: GeneratedAccount;
    message: string;
  };
}
