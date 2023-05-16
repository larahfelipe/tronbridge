import { TransactionMessages } from '@/config';
import type { Transaction } from '@/domain/models';
import { NotFoundError } from '@/errors';
import type { TronWebService } from '@/services';

export class GetTransactionUseCase {
  private static INSTANCE: GetTransactionUseCase;
  private readonly tronWebService: TronWebService;

  private constructor(tronWebService: TronWebService) {
    this.tronWebService = tronWebService;
  }

  static getInstance(tronWebService: TronWebService) {
    if (
      !GetTransactionUseCase.INSTANCE ||
      GetTransactionUseCase.INSTANCE.tronWebService !== tronWebService
    )
      GetTransactionUseCase.INSTANCE = new GetTransactionUseCase(
        tronWebService
      );

    return GetTransactionUseCase.INSTANCE;
  }

  async get({ id }: GetTransactionUseCase.Params) {
    const transactionExists = await this.tronWebService.getTransactionById(id);

    if (!transactionExists)
      throw new NotFoundError(TransactionMessages.NOT_FOUND);

    const transaction: Transaction = {
      txID: transactionExists.txID,
      type: transactionExists.raw_data.contract[0].type,
      isBroadcasted: transactionExists.ret[0].contractRet === 'SUCCESS',
      address: {
        origin: {
          base58: this.tronWebService.hexToBase58(
            transactionExists.raw_data.contract[0].parameter.value.owner_address
          ),
          hex: transactionExists.raw_data.contract[0].parameter.value
            .owner_address
        },
        recipient: {
          base58: this.tronWebService.hexToBase58(
            transactionExists.raw_data.contract[0].parameter.value.to_address
          ),
          hex: transactionExists.raw_data.contract[0].parameter.value.to_address
        }
      },
      amount: transactionExists.raw_data.contract[0].parameter.value.amount,
      block: {
        bytes: transactionExists.raw_data.ref_block_bytes,
        hash: transactionExists.raw_data.ref_block_hash
      },
      signature: transactionExists.signature,
      createdAt: transactionExists.raw_data.timestamp,
      expiresAt: transactionExists.raw_data.expiration
    };

    const res: GetTransactionUseCase.Result = {
      ...transaction
    };

    return res;
  }
}

namespace GetTransactionUseCase {
  export type Params = Record<'id', string>;
  export type Result = Transaction;
}
