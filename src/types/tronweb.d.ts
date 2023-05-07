declare module 'tronweb' {
  export type Options = {
    fullNode?: string;
    fullHost?: string;
    solidityNode?: string;
    eventServer?: string;
    privateKey?: string;
  };

  export type Address = {
    base58: string;
    hex: string;
  };

  export type Account = {
    privateKey: string;
    publicKey: string;
    address: Address;
  };

  export type Transaction = {
    visible: boolean;
    txID: string;
    raw_data: {
      contract: {
        parameter: {
          value: {
            amount: number;
            owner_address: string;
            to_address: string;
          };
          type_url: string;
        };
        type: string;
      };
      ref_block_bytes: string;
      ref_block_hash: string;
      expiration: number;
      timestamp: number;
    };
  };

  export type SignedTransaction = Transaction &
    Record<'signature', Array<string>>;

  export type TransactionBuilder = {
    sendTrx: (
      to: string,
      amount: number,
      from: string
    ) => Promise<Transaction | null>;
  };

  export type Trx = {
    sign: (
      transaction: Transaction,
      privateKey: string
    ) => Promise<SignedTransaction | null>;
  };

  export default class TronWeb {
    constructor(options: Options);
    createAccount(): Promise<Account | null>;
    trx: Trx;
    transactionBuilder: TransactionBuilder;
  }
}
