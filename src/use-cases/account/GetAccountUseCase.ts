import type { Account } from '@/domain/models';
import type { TronGridService, TronWebService } from '@/services';
import { parseMaybeBigNum } from '@/utils';

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

        const [accountExists, accountResources] = await Promise.all([
          this.tronGridService.getAccount(address),
          this.tronWebService.getAccountResources(address)
        ]);

        if (!accountExists) return account;

        const frozenBalance = accountExists.frozenV2.reduce((acc, curr) => {
          if (!Object.keys(curr)?.length || !curr?.amount) return acc;

          return acc + curr.amount;
        }, 0);

        const trc20Assets =
          accountExists.trc20?.map((item) => ({
            id: Object.keys(item)[0],
            balance: parseMaybeBigNum(Object.values(item)[0])
          })) ?? [];

        const trc10Assets =
          accountExists.assetV2?.map(({ key, value }) => ({
            id: key,
            balance: parseMaybeBigNum(value)
          })) ?? [];

        account = {
          active: true,
          address: {
            base58: address,
            hex: accountExists.address
          },
          balance: {
            available: {
              raw: parseMaybeBigNum(accountExists.balance),
              fmt: parseMaybeBigNum(
                this.tronWebService.formatAmount(accountExists.balance, {
                  format: 'fromPrecision'
                })
              )
            },
            frozen: {
              raw: parseMaybeBigNum(frozenBalance),
              fmt: parseMaybeBigNum(
                this.tronWebService.formatAmount(frozenBalance, {
                  format: 'fromPrecision'
                })
              )
            }
          },
          assets: [...trc20Assets, ...trc10Assets],
          resource: {
            bandwidth: {
              used: parseMaybeBigNum(accountResources!.NetUsed),
              limit: parseMaybeBigNum(accountResources!.NetLimit)
            },
            energy: {
              used: parseMaybeBigNum(accountResources!.EnergyUsed),
              limit: parseMaybeBigNum(accountResources!.EnergyLimit)
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
