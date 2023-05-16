declare module 'tronweb' {
  type Maybe<T> = T | null | undefined;

  export type Config = {
    fullNode?: string;
    fullHost?: string;
    solidityNode?: string;
    eventServer?: string;
    privateKey?: string;
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

  export type TransactionContract = {
    type: string;
    parameter: {
      value: {
        amount: number;
        owner_address: string;
        to_address: string;
      };
      type_url: string;
    };
  };

  export type UnsignedTransaction = {
    txID: string;
    visible: boolean;
    raw_data: {
      contract: Array<TransactionContract>;
      ref_block_bytes: string;
      ref_block_hash: string;
      expiration: number;
      timestamp: number;
    };
  };

  export type Transaction = UnsignedTransaction & Record<'signature', [string]>;

  export type TransactionBuilderModule = {
    freezeBalanceV2: (
      amount: number,
      resource: string,
      address: string
    ) => Promise<Maybe<UnsignedTransaction>>;
    sendTrx: (
      to: string,
      amount: number,
      from: string,
      options?: number
    ) => Promise<Maybe<UnsignedTransaction>>;
    sendAsset: (
      to: string,
      amount: number,
      tokenID: string,
      from: string,
      options?: number
    ) => Promise<Maybe<UnsignedTransaction>>;
  };

  export type TrxModule = {
    getTokenByID: (tokenId: string) => Promise<Maybe<Token>>;
    getTokenIssuedByAddress: (tokenAddress: string) => Promise<Maybe<Token>>;
    getBandwidth: (address: string) => Promise<Maybe<number>>;
    getAccountResources: (address: string) => Promise<Maybe<AccountResources>>;
    getTransaction: (
      txId: string
    ) => Promise<
      Maybe<Transaction & Record<'ret', Array<Record<'contractRet', string>>>>
    >;
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
  };

  export default class TronWeb {
    constructor(config: Config);
    createAccount: () => Promise<Maybe<GeneratedAccount>>;
    createRandom: () => Promise<Maybe<GeneratedAccountWithMnemonic>>;
    fromMnemonic: () => Promise<Maybe<GeneratedAccountWithMnemonic>>;
    toSun: (rawValue: number) => number;
    toUtf8: (hexValue: string) => string;
    transactionBuilder: TransactionBuilderModule;
    trx: TrxModule;
    address: AddressModule;
  }
}
