export type Transaction = {
  txID: string;
  type: string;
  assetID: string;
  isBroadcasted: boolean;
  address: {
    origin: Record<'base58' | 'hex', string>;
    recipient: Record<'base58' | 'hex', string> | null;
  };
  amount: Record<'raw' | 'fmt', string>;
  block: {
    number?: number;
    bytes: string;
    hash: string;
  };
  resource?: {
    bandwidthUsage?: number;
    energyUsage?: number;
    energyPenalty?: number;
  };
  signature: Array<string>;
  createdAt: number;
  expiresAt: number;
};
