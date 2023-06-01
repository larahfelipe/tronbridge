export type Token = {
  valid: boolean;
  name: string;
  symbol: string;
  address: Record<'contract' | 'creator', string>;
  decimals: number;
  byteCode?: string;
  abi?: Record<'entrys', unknown>;
};
