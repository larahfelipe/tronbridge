import { TRX, TransactionMessages } from '@/config';
import type { Transaction } from '@/domain/models';
import { NotFoundError } from '@/errors';
import type {
  ContractTransaction,
  TronGridService,
  TronWebService
} from '@/services';
import { parseMaybeBigNum } from '@/utils';

export class GetTransactionUseCase {
  private static INSTANCE: GetTransactionUseCase;
  private readonly tronWebService: TronWebService;
  private readonly tronGridService: TronGridService;

  private constructor(
    tronWebService: TronWebService,
    tronGridService: TronGridService
  ) {
    this.tronWebService = tronWebService;
    this.tronGridService = tronGridService;
  }

  static getInstance(
    tronWebService: TronWebService,
    tronGridService: TronGridService
  ) {
    if (
      !GetTransactionUseCase.INSTANCE ||
      GetTransactionUseCase.INSTANCE.tronWebService !== tronWebService ||
      GetTransactionUseCase.INSTANCE.tronGridService !== tronGridService
    )
      GetTransactionUseCase.INSTANCE = new GetTransactionUseCase(
        tronWebService,
        tronGridService
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

    const originAddress =
      transactionExists.raw_data.contract[0].parameter.value.owner_address;

    let maybeSmartContractAddress =
      transactionExists.raw_data.contract[0].parameter.value.contract_address;

    let smartContractTransactionInfoExists = {} as ContractTransaction;

    if (maybeSmartContractAddress?.length) {
      maybeSmartContractAddress = this.tronWebService.hexToBase58(
        maybeSmartContractAddress
      );

      const accountContractTransactions =
        await this.tronGridService.getAllContractTransactionsByAddress({
          contractAddress: maybeSmartContractAddress,
          accountAddress: originAddress
        });

      smartContractTransactionInfoExists = accountContractTransactions.find(
        ({ transaction_id }) => transaction_id === id
      ) as ContractTransaction;

      if (!smartContractTransactionInfoExists)
        throw new NotFoundError(TransactionMessages.NOT_FOUND);
    }

    const recipientAddress =
      transactionExists.raw_data.contract[0].parameter.value.to_address ??
      smartContractTransactionInfoExists.to;

    const amount =
      transactionExists.raw_data.contract[0].parameter.value.amount ??
      transactionExists.raw_data.contract[0].parameter.value.frozen_balance ??
      transactionExists.raw_data.contract[0].parameter.value.unfreeze_balance ??
      smartContractTransactionInfoExists.value;

    const transaction: Transaction = {
      txID: transactionExists.txID,
      type: transactionExists.raw_data.contract[0].type,
      isBroadcasted:
        transactionExists.ret[0].contractRet === 'SUCCESS' ||
        transactionInfoExists?.receipt.result === 'SUCCESS',
      assetID: maybeSmartContractAddress ?? TRX.SYMBOL,
      address: {
        origin: {
          base58: this.tronWebService.hexToBase58(originAddress),
          hex: originAddress
        },
        ...(recipientAddress?.length && {
          recipient: {
            base58: this.tronWebService.hexToBase58(recipientAddress),
            hex: this.tronWebService.base58ToHex(recipientAddress)
          }
        })
      },
      amount: {
        raw: parseMaybeBigNum(amount),
        fmt: parseMaybeBigNum(
          this.tronWebService.formatAmount(amount, {
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
        type: transactionExists.raw_data.contract[0].parameter.value.resource,
        bandwidthUsage: transactionInfoExists?.receipt?.net_usage,
        energyUsage: transactionInfoExists?.receipt?.energy_usage,
        energyPenalty: transactionInfoExists?.receipt?.energy_penalty_total,
        ...(!!transactionExists.raw_data.fee_limit && {
          gasLimit: {
            raw: parseMaybeBigNum(transactionExists.raw_data.fee_limit),
            fmt: parseMaybeBigNum(
              this.tronWebService.formatAmount(
                transactionExists.raw_data.fee_limit,
                { format: 'fromPrecision' }
              )
            )
          }
        })
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
