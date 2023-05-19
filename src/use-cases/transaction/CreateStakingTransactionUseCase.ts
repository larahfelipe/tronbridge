import { ContractTypes, TRX, TransactionMessages } from '@/config';
import type { Transaction } from '@/domain/models';
import { ApplicationError } from '@/errors';
import type { TronWebService } from '@/services';
import { parseMaybeBigNum } from '@/utils';

export class CreateStakingTransactionUseCase {
  private static INSTANCE: CreateStakingTransactionUseCase;
  private readonly tronWebService: TronWebService;

  private constructor(tronWebService: TronWebService) {
    this.tronWebService = tronWebService;
  }

  static getInstance(tronWebService: TronWebService) {
    if (
      !CreateStakingTransactionUseCase.INSTANCE ||
      CreateStakingTransactionUseCase.INSTANCE.tronWebService !== tronWebService
    )
      CreateStakingTransactionUseCase.INSTANCE =
        new CreateStakingTransactionUseCase(tronWebService);

    return CreateStakingTransactionUseCase.INSTANCE;
  }

  async create(params: CreateStakingTransactionUseCase.Params) {
    const unsignedTransactionPayload =
      await this.tronWebService.buildTransactionRecord({
        ...params,
        contractType: ContractTypes.FREEZE,
        address: {
          origin: params.address,
          recipient: ''
        }
      });

    if (!unsignedTransactionPayload)
      throw new ApplicationError(TransactionMessages.BUILD_EXCEPTION);

    const signedTransactionPayload = await this.tronWebService.signTransaction({
      unsignedTransactionPayload,
      signingKey: params.signingKey
    });

    if (!signedTransactionPayload)
      throw new ApplicationError(TransactionMessages.SIGN_EXCEPTION);

    const newTransaction = await this.tronWebService.broadcastTransaction(
      signedTransactionPayload
    );

    if (!newTransaction)
      throw new ApplicationError(TransactionMessages.BROADCAST_EXCEPTION);

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
        },
        recipient: null
      },
      amount: {
        raw: parseMaybeBigNum(
          newTransaction.transaction.raw_data.contract[0].parameter.value.amount
        ),
        fmt: parseMaybeBigNum(
          this.tronWebService.formatAmount(
            newTransaction.transaction.raw_data.contract[0].parameter.value
              .amount,
            { format: 'fromPrecision' }
          )
        )
      },
      block: {
        bytes: newTransaction.transaction.raw_data.ref_block_bytes,
        hash: newTransaction.transaction.raw_data.ref_block_hash
      },
      signature: newTransaction.transaction.signature,
      createdAt: newTransaction.transaction.raw_data.timestamp,
      expiresAt: newTransaction.transaction.raw_data.expiration
    };

    const res: CreateStakingTransactionUseCase.Result = {
      transaction,
      message: TransactionMessages.CREATED
    };

    return res;
  }
}

namespace CreateStakingTransactionUseCase {
  export type Params = {
    resourceType: string;
    address: string;
    amount: number;
    signingKey: string;
  };
  export type Result = {
    transaction: Transaction;
    message: string;
  };
}
