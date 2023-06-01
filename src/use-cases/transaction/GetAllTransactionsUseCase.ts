import { TRX } from '@/config';
import type { Transaction } from '@/domain/models';
import type {
  ContractTransaction,
  TronGridService,
  TronWebService
} from '@/services';
import { parseMaybeBigNum } from '@/utils';

export class GetAllTransactionsUseCase {
  private static INSTANCE: GetAllTransactionsUseCase;
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
      !GetAllTransactionsUseCase.INSTANCE ||
      GetAllTransactionsUseCase.INSTANCE.tronWebService !== tronWebService ||
      GetAllTransactionsUseCase.INSTANCE.tronGridService !== tronGridService
    )
      GetAllTransactionsUseCase.INSTANCE = new GetAllTransactionsUseCase(
        tronWebService,
        tronGridService
      );

    return GetAllTransactionsUseCase.INSTANCE;
  }

  async get({ address, limit }: GetAllTransactionsUseCase.Params) {
    let transactions: Array<Transaction> = [];

    const [allTransactions, allSmartContractTransactions] = await Promise.all([
      this.tronGridService.getAllTransactionsByAddress({
        accountAddress: address,
        limit: limit as number
      }),
      this.tronGridService.getAllContractTransactionsByAddress({
        accountAddress: address,
        limit: limit as number
      })
    ]);

    if (allTransactions.length) {
      transactions = await Promise.all(
        allTransactions.map(async (transaction) => {
          const transactionInfoExists =
            await this.tronWebService.getTransactionInfoById(transaction.txID);

          const originAddress =
            transaction.raw_data.contract[0].parameter.value.owner_address;

          const maybeSmartContractAddress =
            transaction.raw_data.contract[0].parameter.value.contract_address;

          let smartContractTransactionInfoExists = {} as ContractTransaction;

          if (maybeSmartContractAddress?.length) {
            smartContractTransactionInfoExists =
              allSmartContractTransactions.find(
                ({ transaction_id }) => transaction_id === transaction.txID
              ) as ContractTransaction;

            if (!smartContractTransactionInfoExists) return {} as Transaction;
          }

          const recipientAddress =
            transaction.raw_data.contract[0].parameter.value.to_address ??
            smartContractTransactionInfoExists.to;

          const amount =
            transaction.raw_data.contract[0].parameter.value.amount ??
            transaction.raw_data.contract[0].parameter.value.frozen_balance ??
            transaction.raw_data.contract[0].parameter.value.unfreeze_balance ??
            smartContractTransactionInfoExists.value;

          return {
            txID: transaction.txID,
            type: transaction.raw_data.contract[0].type,
            isBroadcasted: true,
            assetID:
              this.tronWebService.hexToBase58(maybeSmartContractAddress) ??
              TRX.SYMBOL,
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
              bytes: transaction.raw_data.ref_block_bytes,
              hash: transaction.raw_data.ref_block_hash
            },
            resource: {
              type: transaction.raw_data.contract[0].parameter.value.resource,
              bandwidthUsage: transactionInfoExists?.receipt?.net_usage,
              energyUsage: transactionInfoExists?.receipt?.energy_usage,
              energyPenalty:
                transactionInfoExists?.receipt?.energy_penalty_total,
              ...(!!transaction.raw_data.fee_limit && {
                gasLimit: {
                  raw: parseMaybeBigNum(transaction.raw_data.fee_limit),
                  fmt: parseMaybeBigNum(
                    this.tronWebService.formatAmount(
                      transaction.raw_data.fee_limit,
                      { format: 'fromPrecision' }
                    )
                  )
                }
              })
            },
            signature: transaction.signature,
            createdAt: transaction.raw_data.timestamp,
            expiresAt: transaction.raw_data.expiration
          };
        })
      );
    }

    const res: GetAllTransactionsUseCase.Result = {
      transactions
    };

    return res;
  }
}

namespace GetAllTransactionsUseCase {
  export type Params = {
    address: string;
    limit?: unknown;
  };
  export type Result = Record<'transactions', Array<Transaction>>;
}
