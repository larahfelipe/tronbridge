import TronWeb, { type Transaction, type UnsignedTransaction } from 'tronweb';

import {
  ContractTypes,
  DefaultErrorMessages,
  Networks,
  type ResourceTypes
} from '@/config';
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

  async getAccountResources(address: string) {
    const resources = await this.tronWebInstance.trx.getAccountResources(
      address
    );

    return resources;
  }

  async getAccountBandwidth(address: string) {
    const bandwidth = await this.tronWebInstance.trx.getBandwidth(address);

    return bandwidth;
  }

  formatAmount(rawAmount: number, customDecimals?: number) {
    if (rawAmount <= 0)
      throw new ApplicationError('Formatting an invalid amount');

    let amount: number | undefined;

    if (customDecimals && customDecimals > 0) {
      amount = rawAmount * 10 ** customDecimals;
    } else {
      amount = this.tronWebInstance.toSun(rawAmount);
    }

    return amount;
  }

  hexToBase58(hexValue: string) {
    const base58Value = this.tronWebInstance.address.fromHex(hexValue);

    return base58Value;
  }

  async createAccount() {
    const account = await this.tronWebInstance.createAccount();

    return account;
  }

  async getTransactionById(txId: TronWebService.GetTransactionByIdParams) {
    const transaction = await this.tronWebInstance.trx.getTransaction(txId);

    return transaction;
  }

  async buildTransactionRecord({
    contractType = ContractTypes.TRANSFER,
    amount,
    address,
    token,
    resource
  }: TronWebService.BuildTransactionRecordParams) {
    switch (contractType) {
      case ContractTypes.TRANSFER: {
        const formattedAmount = this.formatAmount(
          amount,
          token?.id && token?.decimals ? +token.decimals : 0
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

      case ContractTypes.FREEZE: {
        const formattedAmount = this.formatAmount(amount);

        if (!formattedAmount)
          throw new ApplicationError(DefaultErrorMessages.UNCAUGHT_EXCEPTION);

        const unsignedFreezeTransactionRecord =
          await this.tronWebInstance.transactionBuilder.freezeBalanceV2(
            formattedAmount,
            resource!,
            address.origin
          );

        return unsignedFreezeTransactionRecord;
      }

      default:
        throw new ApplicationError(DefaultErrorMessages.UNCAUGHT_EXCEPTION);
    }
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

  async broadcastTransaction(
    signedTransactionPayload: TronWebService.BroadcastTransactionParams
  ) {
    const transaction = await this.tronWebInstance.trx.sendRawTransaction(
      signedTransactionPayload
    );

    return transaction;
  }
}

namespace TronWebService {
  export type GetTransactionByIdParams = string;
  export type BuildTransactionRecordParams = {
    contractType?: (typeof ContractTypes)[keyof typeof ContractTypes];
    amount: number;
    address: Record<'origin' | 'recipient', string>;
    token?: Record<'id' | 'decimals', string>;
    resource?: (typeof ResourceTypes)[keyof typeof ResourceTypes];
  };
  export type SignTransactionParams = {
    unsignedTransactionPayload: UnsignedTransaction;
    signingKey: string;
  };
  export type BroadcastTransactionParams = Transaction;
}
