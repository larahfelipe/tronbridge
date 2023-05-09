export type Account = {
  active: boolean;
  address: Record<'base58' | 'hex', string>;
  balance: number;
  assets: Array<{
    id: string;
    balance: string | number;
  }>;
  createdAt: number;
  lastSeenAt: number;
};
