import TronWeb, {
  type Config,
  type SmartContractTransactionFunctionSelectorParams,
  type SmartContractTransactionOptions,
  type Transaction,
  type UnsignedTransaction
} from 'tronweb';

import {
  ContractTypes,
  DefaultErrorMessages,
  Networks,
  TRX,
  type ResourceTypes
} from '@/config';
import { ApplicationError } from '@/errors';

export class TronWebService {
  private static INSTANCE: TronWebService;
  private readonly tronWebInstance: TronWeb;
  private readonly network: (typeof Networks)[keyof typeof Networks];

  private constructor(network: (typeof Networks)[keyof typeof Networks]) {
    const connectionConfig: Config =
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

    this.tronWebInstance = new TronWeb(connectionConfig);
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

  formatAmount(
    rawAmount: number,
    options: {
      format?: 'toPrecision' | 'fromPrecision';
      decimals?: number;
    } = {}
  ) {
    if (rawAmount <= 0)
      throw new ApplicationError('Formatting an invalid amount');

    let { format, decimals } = options;

    if (!format) format = 'toPrecision';
    if (!decimals || decimals <= 0) decimals = TRX.DECIMALS;

    let amount: number | undefined;

    switch (format) {
      case 'toPrecision':
        amount = rawAmount * 10 ** decimals;
        break;

      case 'fromPrecision':
        amount = rawAmount / 10 ** decimals;
        break;

      default:
        throw new ApplicationError('Provided an invalid format option');
    }

    return amount;
  }

  hexToBase58(hexValue: string) {
    const base58Value = this.tronWebInstance.address.fromHex(hexValue);

    return base58Value;
  }

  base58ToHex(base58Value: string) {
    const hexValue = this.tronWebInstance.address.toHex(base58Value);

    return hexValue;
  }

  async createAccount() {
    const account = await this.tronWebInstance.createAccount();

    return account;
  }

  async getContractByAddress(contractAddress: string) {
    const contract = await this.tronWebInstance.trx.getContract(
      contractAddress
    );

    return contract;
  }

  async getTransactionById(txId: string) {
    const transaction = await this.tronWebInstance.trx.getTransaction(txId);

    return transaction;
  }

  async getTransactionInfoById(txId: string) {
    const transactionInfo = await this.tronWebInstance.trx.getTransactionInfo(
      txId
    );

    return transactionInfo;
  }

  async buildTransactionRecord({
    contractType = ContractTypes.TRANSFER,
    resource,
    address,
    amount,
    token
  }: TronWebService.BuildTransactionRecordParams) {
    switch (contractType) {
      case ContractTypes.TRANSFER: {
        const formattedAmount = this.formatAmount(amount, {
          decimals: token?.decimals
        });

        if (!formattedAmount)
          throw new ApplicationError(DefaultErrorMessages.UNCAUGHT_EXCEPTION);

        if (token?.id?.length) {
          const isAssetAnSmartContract = await this.getContractByAddress(
            token.id
          );

          if (!isAssetAnSmartContract?.contract_address?.length) {
            const unsignedTrc10TransactionRecord =
              await this.tronWebInstance.transactionBuilder.sendAsset(
                address.recipient,
                formattedAmount,
                token.id,
                address.origin
              );

            return unsignedTrc10TransactionRecord;
          }

          const contractTransactionOptions: SmartContractTransactionOptions = {
            callValue: 0, // The amount of TRX transferred with this transaction
            feeLimit:
              token?.gasLimit > 0 ? this.formatAmount(token.gasLimit) : 50000000 // Max fee willing to pay for this tx (50 TRX by default)
          };

          const contractTransferFunctionParams: Array<SmartContractTransactionFunctionSelectorParams> =
            [
              {
                type: 'address',
                value: address.recipient
              },
              {
                type: 'uint256',
                value: formattedAmount
              }
            ];

          const unsignedSmartContractTransactionRecord =
            await this.tronWebInstance.transactionBuilder.triggerSmartContract(
              token.id,
              'transfer(address,uint256)',
              contractTransactionOptions,
              contractTransferFunctionParams,
              address.origin
            );

          return unsignedSmartContractTransactionRecord?.transaction;
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
  export type BuildTransactionRecordParams = {
    contractType?: (typeof ContractTypes)[keyof typeof ContractTypes];
    resource?: (typeof ResourceTypes)[keyof typeof ResourceTypes];
    address: Record<'origin' | 'recipient', string>;
    amount: number;
    token?: {
      id: string;
      decimals: number;
      gasLimit: number;
    };
  };
  export type SignTransactionParams = {
    unsignedTransactionPayload: UnsignedTransaction;
    signingKey: string;
  };
  export type BroadcastTransactionParams = Transaction;
}
