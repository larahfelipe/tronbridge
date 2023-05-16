export type Transaction = {
  txID: string;
  type: string;
  isBroadcasted: boolean;
  address: {
    origin: Record<'base58' | 'hex', string>;
    recipient: Record<'base58' | 'hex', string> | null;
  };
  amount: number;
  block: Record<'bytes' | 'hash', string>;
  signature: Array<string>;
  createdAt: number;
  expiresAt: number;
};
