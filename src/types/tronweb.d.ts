declare module 'tronweb' {
  export type Options = {
    fullNode?: string;
    fullHost?: string;
    solidityNode?: string;
    eventServer?: string;
    privateKey?: string;
  };

  export type GeneratedAccount = {
    privateKey: string;
    publicKey: string;
    address: {
      base58: string;
      hex: string;
    };
  };

  export type Block = {
    blockID: string;
    block_header: {
      raw_data: {
        number: number;
        txTrieRoot: string;
        witness_address: string;
        parentHash: string;
        timestamp: number;
      };
      witness_signature: string;
    };
    transactions: Array<Transaction>;
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

  export type Transaction = {
    visible: boolean;
    txID: string;
    raw_data: {
      contract: Array<{
        parameter: {
          value: {
            amount: number;
            owner_address: string;
            to_address: string;
          };
          type_url: string;
        };
        type: string;
      }>;
      ref_block_bytes: string;
      ref_block_hash: string;
      expiration: number;
      timestamp: number;
    };
  };

  type InternalTransactionInfo = {
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
    contractResult: Array<string>;
    receipt: {
      net_fee: number;
      origin_energy_usage: number;
      energy_usage_total: number;
      result: string;
    };
    internal_transactions: Array<InternalTransactionInfo>;
  };

  export type SignedTransaction = Transaction &
    Record<'signature', Array<string>>;

  export type TransactionBuilder = {
    sendTrx: (
      to: string,
      amount: number,
      from: string,
      options?: number
    ) => Promise<Transaction | undefined>;
    sendAsset: (
      to: string,
      amount: number,
      tokenID: string,
      from: string,
      options?: number
    ) => Promise<Transaction | undefined>;
  };

  export type Trx = {
    getBalance: (base58Address: string) => Promise<number | undefined>;
    getBlockByHash: (blockHash: string) => Promise<Block | undefined>;
    getTokenByID: (tokenId: string) => Promise<Token | undefined>;
    getTokenIssuedByAddress: (
      tokenAddress: string
    ) => Promise<Token | undefined>;
    getTransaction: (txId: string) => Promise<Transaction | undefined>;
    getTransactionInfo: (txId: string) => Promise<Transaction | undefined>;
    sign: (
      transaction: Transaction,
      privateKey: string
    ) => Promise<SignedTransaction | undefined>;
    sendRawTransaction: (
      signedTransaction: SignedTransaction
    ) => Promise<SignedTransaction | undefined>;
  };

  export default class TronWeb {
    constructor(options: Options);
    createAccount(): Promise<GeneratedAccount | undefined>;
    toSun(amount: number): Promise<number | undefined>;
    trx: Trx;
    transactionBuilder: TransactionBuilder;
  }
}
