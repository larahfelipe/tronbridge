import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

import { Networks } from '@/config';

type Account = {
  address: string;
  balance: number;
  net_usage: number;
  assetV2: Array<{
    key: string;
    value: number;
  }>;
  trc20: Array<{
    [key: string]: number;
  }>;
  create_time: number;
  latest_opration_time: number;
};

export type ContractTransaction = {
  transaction_id: string;
  type: string;
  from: string;
  to: string;
  value: string;
  block_timestamp: number;
  token_info: {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
  };
};

export class TronGridService {
  private static INSTANCE: TronGridService;
  private readonly tronGridAxiosInstance: AxiosInstance;
  private readonly network: (typeof Networks)[keyof typeof Networks];

  private constructor(network: (typeof Networks)[keyof typeof Networks]) {
    const baseURL =
      network === Networks.MAINNET
        ? 'https://api.trongrid.io/v1'
        : 'https://api.shasta.trongrid.io/v1';

    this.tronGridAxiosInstance = axios.create({ baseURL });
    this.network = network;
  }

  static getInstance(network: (typeof Networks)[keyof typeof Networks]) {
    if (
      !TronGridService.INSTANCE ||
      TronGridService.INSTANCE.network !== network
    )
      TronGridService.INSTANCE = new TronGridService(network);

    return TronGridService.INSTANCE;
  }

  async getAccount(base58Address: string) {
    const { data }: AxiosResponse<Record<'data', Array<Account>>> =
      await this.tronGridAxiosInstance.get(`/accounts/${base58Address}`);

    return data.data[0];
  }

  async getAllContractTransactionsByAddress({
    accountAddress,
    contractAddress
  }: TronGridService.getAllContractTransactionsByAddressParams) {
    let uri = `/accounts/${accountAddress}/transactions/trc20`;

    if (contractAddress) uri += `?contract_address=${contractAddress}`;

    const { data }: AxiosResponse<Record<'data', Array<ContractTransaction>>> =
      await this.tronGridAxiosInstance.get(uri);

    return data.data;
  }
}

namespace TronGridService {
  export type getAllContractTransactionsByAddressParams = {
    accountAddress: string;
    contractAddress?: string;
  };
}
