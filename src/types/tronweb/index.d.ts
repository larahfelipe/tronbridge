declare module 'tronweb' {
  type Maybe<T> = T | null | undefined;

  export type Config = {
    fullNode?: string;
    fullHost?: string;
    solidityNode?: string;
    eventServer?: string;
    privateKey?: string;
    headers?: Record<string, string>;
  };

  export type GeneratedAccount = {
    publicKey: string;
    privateKey: string;
    address: Record<'base58' | 'hex', string>;
  };

  export type GeneratedAccountWithMnemonic = Omit<
    GeneratedAccount,
    'address'
  > & {
    mnemonic: {
      phrase: string;
      path: string;
      locale: string;
    };
    address: string;
  };

  export type Token = {
    id: string;
    url: string;
    description: string;
    owner_address: string;
    name: string;
    abbr: string;
    total_supply: number;
    trx_num: number;
    precision: number;
    num: number;
    start_time: number;
    end_time: number;
  };

  export type Block = {
    blockID: string;
    block_header: {
      raw_data: {
        number: number;
        txTrieRoot: string;
        witness_address: string;
        parentHash: string;
        version: number;
        timestamp: number;
      };
      witness_signature: string;
    };
    transactions: Array<Transaction>;
  };

  export type AccountResources = {
    freeNetLimit: number;
    assetNetUsed: Array<{ key: string; value: number }>;
    assetNetLimit: Array<{ key: string; value: number }>;
    NetLimit: number;
    NetUsed: number;
    TotalNetLimit: number;
    TotalNetWeight: number;
    EnergyUsed: number;
    EnergyLimit: number;
    TotalEnergyLimit: number;
    TotalEnergyWeight: number;
  };

  export type Contract = {
    bytecode: string;
    name: string;
    origin_address: string;
    contract_address: string;
    abi: Record<'entrys', unknown>;
  };

  export type SmartContractTransactionOptions = {
    feeLimit?: number;
    callValue?: number;
    tokenId?: string;
    tokenValue?: number;
    Permission_id?: number;
  };

  export type SmartContractTransactionFunctionSelectorParams = {
    type: string;
    value: string | number;
  };

  export type TransactionContract = {
    type: string;
    parameter: {
      value: {
        resource: string;
        amount: number;
        frozen_balance: number;
        unfreeze_balance: number;
        owner_address: string;
        to_address: string;
        contract_address: string;
      };
      type_url: string;
    };
  };

  export type UnsignedTransaction = {
    txID: string;
    visible: boolean;
    block_timestamp: number;
    raw_data: {
      contract: Array<TransactionContract>;
      ref_block_bytes: string;
      ref_block_hash: string;
      fee_limit: number;
      expiration: number;
      timestamp: number;
    };
  };

  export type TransactionLog = {
    address: string;
    topics: Array<unknown>;
    data: string;
  };

  export type InternalTransactions = {
    hash: string;
    caller_address: string;
    transferTo_address: string;
    callValueInfo: Array<unknown>;
    note: string;
  };

  export type TransactionInfo = {
    id: string;
    fee: number;
    blockNumber: number;
    blockTimeStamp: number;
    contractResult: Array<unknown>;
    receipt: {
      result?: string;
      net_usage?: number;
      energy_usage?: number;
      energy_usage_total?: number;
      energy_penalty_total?: number;
    };
    log: Array<TransactionLog>;
    internal_transactions: Array<InternalTransactions>;
  };

  export type Transaction = UnsignedTransaction & Record<'signature', [string]>;

  export type TransactionBuilderModule = {
    freezeBalanceV2: (
      amount: string | number,
      resource: string,
      address: string
    ) => Promise<Maybe<UnsignedTransaction>>;
    unfreezeBalanceV2: (
      amount: string | number,
      resource: string,
      address: string
    ) => Promise<Maybe<UnsignedTransaction>>;
    triggerSmartContract: (
      contractAddress: string,
      functionSelector: string,
      txOptions: SmartContractTransactionOptions,
      functionSelectorParameters: Array<SmartContractTransactionFunctionSelectorParams>,
      recipientAddress: string
    ) => Promise<Maybe<Record<'transaction', UnsignedTransaction>>>;
    sendTrx: (
      to: string,
      amount: string | number,
      from: string,
      options?: number
    ) => Promise<Maybe<UnsignedTransaction>>;
    sendAsset: (
      to: string,
      amount: string | number,
      tokenID: string,
      from: string,
      options?: number
    ) => Promise<Maybe<UnsignedTransaction>>;
  };

  export type TrxModule = {
    getTokenByID: (tokenId: string) => Promise<Maybe<Token>>;
    getTokenIssuedByAddress: (tokenAddress: string) => Promise<Maybe<Token>>;
    getAccountResources: (address: string) => Promise<Maybe<AccountResources>>;
    getContract: (contractAddress: string) => Promise<Maybe<Contract>>;
    getTransaction: (
      txId: string
    ) => Promise<
      Maybe<Transaction & Record<'ret', Array<Record<'contractRet', string>>>>
    >;
    getTransactionInfo: (txId: string) => Promise<Maybe<TransactionInfo>>;
    sign: (
      unsignedTransaction: UnsignedTransaction,
      privateKey: string
    ) => Promise<Maybe<Transaction>>;
    sendRawTransaction: (
      signedTransaction: Transaction
    ) => Promise<Maybe<{ result: boolean; transaction: Transaction }>>;
  };

  export type AddressModule = {
    fromHex: (hexValue: string) => string;
    toHex: (base58Value: string) => string;
  };

  export default class TronWeb {
    constructor(config: Config);
    createAccount: () => Promise<Maybe<GeneratedAccount>>;
    createRandom: () => Promise<Maybe<GeneratedAccountWithMnemonic>>;
    fromMnemonic: () => Promise<Maybe<GeneratedAccountWithMnemonic>>;
    toUtf8: (hexValue: string) => string;
    transactionBuilder: TransactionBuilderModule;
    trx: TrxModule;
    address: AddressModule;
  }
}
