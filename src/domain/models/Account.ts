export type Account = {
  active: boolean;
  address: Record<'base58' | 'hex', string>;
  balance: {
    available: Record<'raw' | 'fmt', string>;
    frozen: Record<'raw' | 'fmt', string>;
  };
  assets: Array<Record<'id' | 'balance', string>>;
  resource: {
    bandwidth: Record<'used' | 'limit', string>;
    energy: Record<'used' | 'limit', string>;
  };
  createdAt: number;
  lastSeenAt: number;
};

export type GeneratedAccount = {
  mnemonic: Record<'phrase' | 'path' | 'locale', string>;
  publicKey: string;
  privateKey: string;
  address: Record<'base58' | 'hex', string>;
};
