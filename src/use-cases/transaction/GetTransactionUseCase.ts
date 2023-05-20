import { TRX, TransactionMessages } from '@/config';
import type { Transaction } from '@/domain/models';
import { NotFoundError } from '@/errors';
import type { TronWebService } from '@/services';
import { parseMaybeBigNum } from '@/utils';

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
    const [transactionExists, transactionInfoExists] = await Promise.all([
      this.tronWebService.getTransactionById(id),
      this.tronWebService.getTransactionInfoById(id)
    ]);

    if (!transactionExists)
      throw new NotFoundError(TransactionMessages.NOT_FOUND);

    const smartContractAddress =
      transactionExists.raw_data.contract[0].parameter.value.contract_address;

    const recipientAddress =
      transactionExists.raw_data.contract[0].parameter.value.to_address;

    const transactionAmount =
      transactionExists.raw_data.contract[0].parameter.value.amount ??
      transactionExists.raw_data.contract[0].parameter.value.frozen_balance;

    const transaction: Transaction = {
      txID: transactionExists.txID,
      type: transactionExists.raw_data.contract[0].type,
      isBroadcasted: transactionExists.ret[0].contractRet === 'SUCCESS',
      assetID: smartContractAddress ? smartContractAddress : TRX.SYMBOL,
      address: {
        origin: {
          base58: this.tronWebService.hexToBase58(
            transactionExists.raw_data.contract[0].parameter.value.owner_address
          ),
          hex: transactionExists.raw_data.contract[0].parameter.value
            .owner_address
        },
        recipient: recipientAddress
          ? {
              base58: this.tronWebService.hexToBase58(recipientAddress),
              hex: recipientAddress
            }
          : null
      },
      amount: {
        raw: parseMaybeBigNum(transactionAmount),
        fmt: parseMaybeBigNum(
          this.tronWebService.formatAmount(transactionAmount, {
            format: 'fromPrecision'
          })
        )
      },
      block: {
        number: transactionInfoExists?.blockNumber,
        bytes: transactionExists.raw_data.ref_block_bytes,
        hash: transactionExists.raw_data.ref_block_hash
      },
      resource: {
        bandwidthUsage: transactionInfoExists?.receipt?.net_usage,
        energyUsage: transactionInfoExists?.receipt?.energy_usage,
        energyPenalty: transactionInfoExists?.receipt?.energy_penalty_total
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
