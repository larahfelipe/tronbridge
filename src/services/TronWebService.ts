import TronWeb from 'tronweb';

export class TronWebService {
  private static INSTANCE: TronWebService;
  private readonly tronWebMainnet: TronWeb;
  private readonly tronWebTestnet: TronWeb;

  private constructor() {
    this.tronWebMainnet = new TronWeb({
      fullNode: 'https://api.trongrid.io',
      solidityNode: 'https://api.trongrid.io',
      eventServer: 'https://api.trongrid.io'
    });
    this.tronWebTestnet = new TronWeb({
      fullNode: 'https://api.shasta.trongrid.io',
      solidityNode: 'https://api.shasta.trongrid.io',
      eventServer: 'https://api.shasta.trongrid.io'
    });
  }

  static getInstance() {
    if (!TronWebService.INSTANCE)
      TronWebService.INSTANCE = new TronWebService();

    return TronWebService.INSTANCE;
  }

  get mainnet() {
    return this.tronWebMainnet;
  }

  get testnet() {
    return this.tronWebTestnet;
  }
}
