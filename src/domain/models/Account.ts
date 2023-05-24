export type Account = {
  active: boolean;
  address: Record<'base58' | 'hex', string>;
  balance: Record<'raw' | 'fmt', string>;
  assets: Array<Record<'id' | 'balance', string>>;
  resource: {
    bandwidth: Record<'used' | 'limit', string>;
    energy: Record<'used' | 'limit', string>;
  };
  createdAt: number;
  lastSeenAt: number;
};
