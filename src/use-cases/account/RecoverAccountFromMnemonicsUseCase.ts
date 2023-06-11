import { AccountMessages } from '@/config';
import type { GeneratedAccount } from '@/domain/models';
import { NotFoundError } from '@/errors';
import type { TronWebService } from '@/services';

export class RecoverAccountFromMnemonicsUseCase {
  private static INSTANCE: RecoverAccountFromMnemonicsUseCase;
  private readonly tronWebService: TronWebService;

  private constructor(tronWebService: TronWebService) {
    this.tronWebService = tronWebService;
  }

  static getInstance(tronWebService: TronWebService) {
    if (
      !RecoverAccountFromMnemonicsUseCase.INSTANCE ||
      tronWebService !== this.INSTANCE.tronWebService
    )
      RecoverAccountFromMnemonicsUseCase.INSTANCE =
        new RecoverAccountFromMnemonicsUseCase(tronWebService);

    return RecoverAccountFromMnemonicsUseCase.INSTANCE;
  }

  async recover({ mnemonics }: RecoverAccountFromMnemonicsUseCase.Params) {
    const accountExists = await this.tronWebService.getAccountFromMnemonics(
      mnemonics
    );

    if (!accountExists) throw new NotFoundError(AccountMessages.NOT_FOUND);

    const account: GeneratedAccount = {
      mnemonic: accountExists.mnemonic,
      privateKey: accountExists.privateKey.slice(2).toUpperCase(),
      publicKey: accountExists.publicKey.slice(2).toUpperCase(),
      address: {
        base58: accountExists.address,
        hex: this.tronWebService.base58ToHex(accountExists.address)
      }
    };

    const res: RecoverAccountFromMnemonicsUseCase.Result = {
      ...account
    };

    return res;
  }
}

namespace RecoverAccountFromMnemonicsUseCase {
  export type Params = Record<'mnemonics', string>;
  export type Result = GeneratedAccount;
}
