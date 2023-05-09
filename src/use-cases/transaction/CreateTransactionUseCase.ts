import { TransactionMessages } from '@/config';
import type { Transaction } from '@/domain/models';
import { ApplicationError } from '@/errors';
import type { TronWebService } from '@/services';

export class CreateTransactionUseCase {
  private static INSTANCE: CreateTransactionUseCase;
  private readonly tronWebService: TronWebService;

  private constructor(tronWebService: TronWebService) {
    this.tronWebService = tronWebService;
  }

  static getInstance(tronWebService: TronWebService) {
    if (
      !CreateTransactionUseCase.INSTANCE ||
      CreateTransactionUseCase.INSTANCE.tronWebService !== tronWebService
    )
      CreateTransactionUseCase.INSTANCE = new CreateTransactionUseCase(
        tronWebService
      );

    return CreateTransactionUseCase.INSTANCE;
  }

  async create(params: CreateTransactionUseCase.Params) {
    const { address, signingKey } = params;

    const unsignedTransactionPayload =
      await this.tronWebService.buildTransactionRecord(params);

    if (!unsignedTransactionPayload)
      throw new ApplicationError(TransactionMessages.BUILD_EXCEPTION);

    const signedTransactionPayload = await this.tronWebService.signTransaction({
      unsignedTransactionPayload,
      signingKey
    });

    if (!signedTransactionPayload)
      throw new ApplicationError(TransactionMessages.SIGN_EXCEPTION);

    const newTransaction: any =
      await this.tronWebService.broadcastSignedTransaction(
        signedTransactionPayload
      );

    if (!newTransaction)
      throw new ApplicationError(TransactionMessages.BROADCAST_EXCEPTION);

    const transaction: Transaction = {
      txID: newTransaction.transaction.txID,
      type: newTransaction.transaction.raw_data.contract[0].type,
      isBroadcasted: newTransaction.result,
      address: {
        origin: {
          base58: address.origin,
          hex: newTransaction.transaction.raw_data.contract[0].parameter.value
            .owner_address
        },
        recipient: {
          base58: address.recipient,
          hex: newTransaction.transaction.raw_data.contract[0].parameter.value
            .to_address
        }
      },
      amount:
        newTransaction.transaction.raw_data.contract[0].parameter.value.amount,
      block: {
        bytes: newTransaction.transaction.raw_data.ref_block_bytes,
        hash: newTransaction.transaction.raw_data.ref_block_hash
      },
      signature: newTransaction.transaction.signature,
      createdAt: newTransaction.transaction.raw_data.timestamp,
      expiresAt: newTransaction.transaction.raw_data.expiration
    };

    const res: CreateTransactionUseCase.Result = {
      transaction,
      message: TransactionMessages.CREATED
    };

    return res;
  }
}

namespace CreateTransactionUseCase {
  export type Params = {
    address: Record<'origin' | 'recipient', string>;
    signingKey: string;
    amount: number;
    tokenID?: string;
  };
  export type Result = {
    transaction: Transaction;
    message: string;
  };
}
