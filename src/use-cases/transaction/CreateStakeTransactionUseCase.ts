import {
  ContractTypes,
  TRX,
  TransactionMessages,
  type ResourceTypes
} from '@/config';
import type { Transaction } from '@/domain/models';
import { ApplicationError } from '@/errors';
import type { TronWebService } from '@/services';
import { parseMaybeBigNum } from '@/utils';

export class CreateStakeTransactionUseCase {
  private static INSTANCE: CreateStakeTransactionUseCase;
  private readonly tronWebService: TronWebService;

  private constructor(tronWebService: TronWebService) {
    this.tronWebService = tronWebService;
  }

  static getInstance(tronWebService: TronWebService) {
    if (
      !CreateStakeTransactionUseCase.INSTANCE ||
      CreateStakeTransactionUseCase.INSTANCE.tronWebService !== tronWebService
    )
      CreateStakeTransactionUseCase.INSTANCE =
        new CreateStakeTransactionUseCase(tronWebService);

    return CreateStakeTransactionUseCase.INSTANCE;
  }

  async create({
    amount,
    address,
    contractType,
    resourceType,
    signingKey
  }: CreateStakeTransactionUseCase.Params) {
    const unsignedTransactionPayload =
      await this.tronWebService.buildTransactionRecord({
        amount,
        contractType:
          contractType as (typeof ContractTypes)[keyof typeof ContractTypes],
        resourceType:
          resourceType as (typeof ResourceTypes)[keyof typeof ResourceTypes],
        address: {
          origin: address,
          recipient: ''
        }
      });

    if (!unsignedTransactionPayload)
      throw new ApplicationError(TransactionMessages.BUILD_EXCEPTION);

    const signedTransactionPayload = await this.tronWebService.signTransaction({
      unsignedTransactionPayload,
      signingKey
    });

    if (!signedTransactionPayload)
      throw new ApplicationError(TransactionMessages.SIGN_EXCEPTION);

    const newTransaction = await this.tronWebService.broadcastTransaction(
      signedTransactionPayload
    );

    if (!newTransaction)
      throw new ApplicationError(TransactionMessages.BROADCAST_EXCEPTION);

    const transactionAmount =
      contractType === ContractTypes.FREEZE
        ? newTransaction.transaction.raw_data.contract[0].parameter.value
            .frozen_balance
        : newTransaction.transaction.raw_data.contract[0].parameter.value
            .unfreeze_balance;

    const transaction: Transaction = {
      txID: newTransaction.transaction.txID,
      type: newTransaction.transaction.raw_data.contract[0].type,
      isBroadcasted: newTransaction.result,
      assetID: TRX.SYMBOL,
      address: {
        origin: {
          base58: this.tronWebService.hexToBase58(
            newTransaction.transaction.raw_data.contract[0].parameter.value
              .owner_address
          ),
          hex: newTransaction.transaction.raw_data.contract[0].parameter.value
            .owner_address
        }
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
        bytes: newTransaction.transaction.raw_data.ref_block_bytes,
        hash: newTransaction.transaction.raw_data.ref_block_hash
      },
      resource: {
        type: resourceType.toUpperCase()
      },
      signature: newTransaction.transaction.signature,
      createdAt: newTransaction.transaction.raw_data.timestamp,
      expiresAt: newTransaction.transaction.raw_data.expiration
    };

    const res: CreateStakeTransactionUseCase.Result = {
      transaction,
      message: TransactionMessages.CREATED
    };

    return res;
  }
}

namespace CreateStakeTransactionUseCase {
  export type Params = {
    amount: number;
    address: string;
    contractType: string;
    resourceType: string;
    signingKey: string;
  };
  export type Result = {
    transaction: Transaction;
    message: string;
  };
}
