import { TRX, TransactionMessages } from '@/config';
import type { Transaction } from '@/domain/models';
import { ApplicationError } from '@/errors';
import type { TronWebService } from '@/services';
import { parseMaybeBigNum } from '@/utils';

export class CreateTransferTransactionUseCase {
  private static INSTANCE: CreateTransferTransactionUseCase;
  private readonly tronWebService: TronWebService;

  private constructor(tronWebService: TronWebService) {
    this.tronWebService = tronWebService;
  }

  static getInstance(tronWebService: TronWebService) {
    if (
      !CreateTransferTransactionUseCase.INSTANCE ||
      CreateTransferTransactionUseCase.INSTANCE.tronWebService !==
        tronWebService
    )
      CreateTransferTransactionUseCase.INSTANCE =
        new CreateTransferTransactionUseCase(tronWebService);

    return CreateTransferTransactionUseCase.INSTANCE;
  }

  async create(params: CreateTransferTransactionUseCase.Params) {
    const { signingKey, token, amount, address } = params;

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

    const newTransaction = await this.tronWebService.broadcastTransaction(
      signedTransactionPayload
    );

    if (!newTransaction)
      throw new ApplicationError(TransactionMessages.BROADCAST_EXCEPTION);

    const transaction: Transaction = {
      txID: newTransaction.transaction.txID,
      type: newTransaction.transaction.raw_data.contract[0].type,
      isBroadcasted: newTransaction.result,
      assetID: token?.id?.length ? token.id : TRX.SYMBOL,
      address: {
        origin: {
          base58: this.tronWebService.hexToBase58(
            newTransaction.transaction.raw_data.contract[0].parameter.value
              .owner_address
          ),
          hex: newTransaction.transaction.raw_data.contract[0].parameter.value
            .owner_address
        },
        recipient: {
          base58:
            this.tronWebService.hexToBase58(
              newTransaction.transaction.raw_data.contract[0].parameter.value
                .to_address
            ) ?? address.recipient,
          hex:
            newTransaction.transaction.raw_data.contract[0].parameter.value
              .to_address ?? this.tronWebService.base58ToHex(address.recipient)
        }
      },
      amount: {
        raw: parseMaybeBigNum(
          newTransaction.transaction.raw_data.contract[0].parameter.value
            .amount,
          this.tronWebService
            .formatAmount(amount, { decimals: token?.decimals })
            .toString()
        ),
        fmt: parseMaybeBigNum(
          this.tronWebService.formatAmount(
            newTransaction.transaction.raw_data.contract[0].parameter.value
              .amount,
            { format: 'fromPrecision', decimals: token?.decimals }
          ),
          amount.toString()
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

    const res: CreateTransferTransactionUseCase.Result = {
      transaction,
      message: TransactionMessages.CREATED
    };

    return res;
  }
}

namespace CreateTransferTransactionUseCase {
  export type Params = {
    amount: number;
    address: Record<'origin' | 'recipient', string>;
    token?: {
      id: string;
      decimals: number;
      gasLimit: number;
    };
    signingKey: string;
  };
  export type Result = {
    transaction: Transaction;
    message: string;
  };
}
