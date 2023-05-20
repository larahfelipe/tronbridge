```
TronBridge API Documentation

Available networks:
- Mainnet (https://api.trongrid.io)
- Shasta Testnet (https://api.shasta.trongrid.io)

--

Usage example (Mainnet):

Account:
- GET /v1/account/mainnet?address=<ADDRESS>

  P.S:
    1. Address parameter supports multiple addresses separated by comma.

- POST /v1/account/mainnet

Transaction:
- GET /v1/transaction/mainnet?id=<TRANSACTION_ID>

- POST /v1/transaction/mainnet/transfer
  body: {
    "amount": <AMOUNT>,
    "address": {
      "origin": <ORIGIN_ADDRESS>
      "recipient": <RECIPIENT_ADDRESS>
    },
    "token": {
      "id": <TOKEN_ID>,
      "decimals": <TOKEN_DECIMALS>,
    },
    "signingKey": <ORIGIN_PRIVATE_KEY>
  }

  P.S:
    1. <AMOUNT> is the amount of asset that will be sent to the recipient, format is number;
    2. <ORIGIN_ADDRESS> is the origin address of the transaction;
    3. <RECIPIENT_ADDRESS> is the recipient address of the transaction;
    4. <TOKEN_ID> is the token id of the asset that will be sent to the recipient, if leave empty, it will be considered as TRX;
    5. <TOKEN_DECIMALS> is the decimals of the asset that will be sent to the recipient, if leave empty, it will be considered as 6;
    6. <ORIGIN_PRIVATE_KEY> is the private key of the origin address, it will be used to sign the transaction.

- POST /v1/transaction/mainnet/staking
  body: {
    "resourceType": <RESOURCE_TYPE>,
    "amount": <AMOUNT>,
    "address": <ORIGIN_ADDRESS>
    "signingKey": <ORIGIN_PRIVATE_KEY>
  }

  P.S:
    1. <RESOURCE_TYPE> is the type of resource that will be staked, it can be "BANDWIDTH" or "ENERGY";
    2. <AMOUNT> is the amount of resource that will be staked, format is number;
    3. <ORIGIN_ADDRESS> is the origin address of the transaction;
    4. <ORIGIN_PRIVATE_KEY> is the private key of the origin address, it will be used to sign the transaction.
```
