import type { Account } from '@/domain/models';
import type { TronGridService } from '@/services';

export class GetAccountUseCase {
  private static INSTANCE: GetAccountUseCase;
  private readonly tronGridService: TronGridService;

  private constructor(tronGridService: TronGridService) {
    this.tronGridService = tronGridService;
  }

  static getInstance(tronGridService: TronGridService) {
    if (
      !GetAccountUseCase.INSTANCE ||
      tronGridService !== this.INSTANCE.tronGridService
    )
      GetAccountUseCase.INSTANCE = new GetAccountUseCase(tronGridService);

    return GetAccountUseCase.INSTANCE;
  }

  async get({ address }: GetAccountUseCase.Params) {
    const addresses = address.split(',').filter(Boolean);

    const accounts = await Promise.all(
      addresses.map(async (address) => {
        let account = {
          active: false,
          address: {
            base58: address
          }
        } as Account;

        const accountExists = await this.tronGridService.getAccount(address);

        if (!accountExists) return account;

        const trc20Assets =
          accountExists.trc20?.map((item) => ({
            id: Object.keys(item)[0],
            balance: Object.values(item)[0]
          })) ?? [];

        const trc10Assets =
          accountExists.assetV2?.map(({ key, value }) => ({
            id: key,
            balance: value.toLocaleString('en-US', { useGrouping: false })
          })) ?? [];

        account = {
          active: true,
          address: {
            base58: address,
            hex: accountExists.address
          },
          balance: accountExists.balance,
          assets: [...trc20Assets, ...trc10Assets],
          createdAt: accountExists.create_time,
          lastSeenAt: accountExists.latest_opration_time
        };

        return account;
      })
    );

    const res: GetAccountUseCase.Result = {
      accounts
    };

    return res;
  }
}

namespace GetAccountUseCase {
  export type Params = Record<'address', string>;
  export type Result = Record<'accounts', Array<Account>>;
}
