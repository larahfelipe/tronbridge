import type { Token } from '@/domain/models';
import type { TronGridService, TronWebService } from '@/services';

export class GetTokenUseCase {
  private static INSTANCE: GetTokenUseCase;
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
      !GetTokenUseCase.INSTANCE ||
      tronGridService !== this.INSTANCE.tronGridService ||
      tronWebService !== this.INSTANCE.tronWebService
    )
      GetTokenUseCase.INSTANCE = new GetTokenUseCase(
        tronGridService,
        tronWebService
      );

    return GetTokenUseCase.INSTANCE;
  }

  async get({ id, include_bytecode, include_abi }: GetTokenUseCase.Params) {
    const tokensIds = id.split(',').filter(Boolean);

    const tokens = await Promise.all(
      tokensIds.map(async (tokenId) => {
        let token = {
          valid: false,
          address: {
            contract: tokenId
          }
        } as Token;

        const tokenExists = await this.tronWebService.getContractByAddress(
          tokenId
        );

        if (!tokenExists) return token;

        const tokenSmartContractExists = await this.tronWebService.callContract(
          {
            contractAddress: tokenId
          }
        );

        if (!tokenSmartContractExists) return token;

        const [tokenName, tokenSymbol, tokenDecimals] = (await Promise.all([
          tokenSmartContractExists.name().call(),
          tokenSmartContractExists.symbol().call(),
          tokenSmartContractExists.decimals().call()
        ])) as [string, string, number];

        token = {
          valid: true,
          name: tokenName,
          symbol: tokenSymbol,
          address: {
            contract: this.tronWebService.hexToBase58(
              tokenExists.contract_address
            ),
            creator: this.tronWebService.hexToBase58(tokenExists.origin_address)
          },
          decimals: tokenDecimals,
          ...(!!include_bytecode && {
            byteCode: tokenExists.bytecode
          }),
          ...(!!include_abi && {
            abi: tokenExists.abi
          })
        };

        return token;
      })
    );

    const res: GetTokenUseCase.Result = {
      tokens
    };

    return res;
  }
}

namespace GetTokenUseCase {
  export type Params = {
    id: string;
    include_abi?: unknown;
    include_bytecode?: unknown;
  };
  export type Result = Record<'tokens', Array<Token>>;
}
