import TronWeb, { type SignedTransaction, type Transaction } from 'tronweb';

import { DefaultErrorMessages, Networks } from '@/config';
import { ApplicationError } from '@/errors';

export class TronWebService {
  private static INSTANCE: TronWebService;
  private readonly tronWebInstance: TronWeb;
  private readonly network: (typeof Networks)[keyof typeof Networks];

  private constructor(network: (typeof Networks)[keyof typeof Networks]) {
    const connectionOptions =
      network === Networks.MAINNET
        ? {
            fullNode: 'https://api.trongrid.io',
            solidityNode: 'https://api.trongrid.io',
            eventServer: 'https://api.trongrid.io'
          }
        : {
            fullNode: 'https://api.shasta.trongrid.io',
            solidityNode: 'https://api.shasta.trongrid.io',
            eventServer: 'https://api.shasta.trongrid.io'
          };

    this.tronWebInstance = new TronWeb(connectionOptions);
    this.network = network;
  }

  static getInstance(network: (typeof Networks)[keyof typeof Networks]) {
    if (!TronWebService.INSTANCE || TronWebService.INSTANCE.network !== network)
      TronWebService.INSTANCE = new TronWebService(network);

    return TronWebService.INSTANCE;
  }

  async createAccount() {
    const account = await this.tronWebInstance.createAccount();

    return account;
  }

  async formatAmount(rawAmount: number, customDecimals?: number) {
    if (rawAmount <= 0)
      throw new ApplicationError('Formatting an invalid amount');

    let amount: number | undefined;

    if (customDecimals && customDecimals > 0) {
      amount = rawAmount * 10 ** customDecimals;
    } else {
      amount = await this.tronWebInstance.toSun(rawAmount);
    }

    return amount;
  }

  async buildTransactionRecord({
    token,
    address,
    amount
  }: TronWebService.BuildTransactionRecordParams) {
    const formattedAmount = await this.formatAmount(
      amount,
      token?.id && token?.decimals ? token.decimals : 0
    );

    if (!formattedAmount)
      throw new ApplicationError(DefaultErrorMessages.UNCAUGHT_EXCEPTION);

    if (token?.id?.length) {
      const unsignedTrc10TransactionRecord =
        await this.tronWebInstance.transactionBuilder.sendAsset(
          address.recipient,
          formattedAmount,
          token.id,
          address.origin
        );

      return unsignedTrc10TransactionRecord;
    }

    const unsignedTrxTransactionRecord =
      await this.tronWebInstance.transactionBuilder.sendTrx(
        address.recipient,
        formattedAmount,
        address.origin
      );

    return unsignedTrxTransactionRecord;
  }

  async signTransaction({
    unsignedTransactionPayload,
    signingKey
  }: TronWebService.SignTransactionParams) {
    const signedTransactionRecord = await this.tronWebInstance.trx.sign(
      unsignedTransactionPayload,
      signingKey
    );

    return signedTransactionRecord;
  }

  async broadcastSignedTransaction(
    signedTransactionPayload: TronWebService.BroadcastSignedTransactionParams
  ) {
    const transaction = await this.tronWebInstance.trx.sendRawTransaction(
      signedTransactionPayload
    );

    return transaction;
  }
}

namespace TronWebService {
  export type BuildTransactionRecordParams = {
    amount: number;
    address: Record<'origin' | 'recipient', string>;
    token?: {
      id: string;
      decimals: number;
    };
  };
  export type SignTransactionParams = {
    unsignedTransactionPayload: Transaction;
    signingKey: string;
  };
  export type BroadcastSignedTransactionParams = SignedTransaction;
}
