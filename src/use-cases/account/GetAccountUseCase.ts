import type { Account } from '@/domain/models';
import type { TronGridService, TronWebService } from '@/services';
import { parseBigNumValue } from '@/utils';

export class GetAccountUseCase {
  private static INSTANCE: GetAccountUseCase;
  private readonly tronGridService: TronGridService;
  private readonly tronWebService: TronWebService;

  private constructor(
    tronGridService: TronGridService,
    tronWebService: TronWebService
  ) {
    this.tronGridService = tronGridService;
    this.tronWebService = tronWebService;
  }

  static getInstance(
    tronGridService: TronGridService,
    tronWebService: TronWebService
  ) {
    if (
      !GetAccountUseCase.INSTANCE ||
      tronGridService !== this.INSTANCE.tronGridService ||
      tronWebService !== this.INSTANCE.tronWebService
    )
      GetAccountUseCase.INSTANCE = new GetAccountUseCase(
        tronGridService,
        tronWebService
      );

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

        const accountResources = await this.tronWebService.getAccountResources(
          address
        );

        const trc20Assets =
          accountExists.trc20?.map((item) => ({
            id: Object.keys(item)[0],
            balance: parseBigNumValue(Object.values(item)[0])
          })) ?? [];

        const trc10Assets =
          accountExists.assetV2?.map(({ key, value }) => ({
            id: key,
            balance: parseBigNumValue(value)
          })) ?? [];

        account = {
          active: true,
          address: {
            base58: address,
            hex: accountExists.address
          },
          balance: {
            raw: parseBigNumValue(accountExists.balance),
            fmt: parseBigNumValue(accountExists.balance / 1e6)
          },
          assets: [...trc20Assets, ...trc10Assets],
          resources: {
            bandwidth: {
              used: parseBigNumValue(accountResources!.NetUsed),
              limit: parseBigNumValue(accountResources!.NetLimit)
            },
            energy: {
              used: parseBigNumValue(accountResources!.EnergyUsed),
              limit: parseBigNumValue(accountResources!.EnergyLimit)
            }
          },
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
