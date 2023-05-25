<p align="center">
  <img src="https://github.com/larahfelipe/tronbridge/blob/master/public/tronicon.png" width="200" height="200" />
</p>

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
      "origin": <ORIGIN_ADDRESS>,
      "recipient": <RECIPIENT_ADDRESS>
    },
    "token": {
      "id": <TOKEN_ID>,
      "decimals": <TOKEN_DECIMALS>,
      "gasLimit": <GAS_LIMIT>
    },
    "signingKey": <ORIGIN_PRIVATE_KEY>
  }

  P.S:
    1. <AMOUNT> [NUMBER] is the amount of asset that will be sent to the recipient (*);
    2. <ORIGIN_ADDRESS> [STRING] is the origin address of the transaction;
    3. <RECIPIENT_ADDRESS> [STRING] is the recipient address of the transaction;
    4. <TOKEN_ID> [STRING] is the token id of the asset that will be sent to the recipient (**);
    5. <TOKEN_DECIMALS> [NUMBER] is the decimals of the asset that will be sent to the recipient (***);
    6. <GAS_LIMIT> [NUMBER] is the maximum gas consumption for the smart contract transaction (*)(****);
    7. <ORIGIN_PRIVATE_KEY> [STRING] is the private key of the origin address, it will be used to sign the transaction.

  * The amount should be provided without multiplying by decimals, use the actual amount as it is.
  ** If the token id is not provided/left empty (`""`), it will be considered as TRX transaction.
  *** If the token decimals is not provided/left empty (`0`), it will default to `6` (TRX decimals).
  **** If it's not a smart contract transaction, the gas limit can be ignored and leave empty (`0`).

- POST /v1/transaction/mainnet/staking
  body: {
    "amount": <AMOUNT>,
    "address": <ORIGIN_ADDRESS>,
    "resourceType": <RESOURCE_TYPE>,
    "signingKey": <ORIGIN_PRIVATE_KEY>
  }

  P.S:
    1. <AMOUNT> [NUMBER] is the amount of resource that will be staked (*);
    2. <ORIGIN_ADDRESS> [STRING] is the origin address of the transaction;
    3. <RESOURCE_TYPE> [STRING] is the type of resource that will be staked, it can be "BANDWIDTH" or "ENERGY";
    4. <ORIGIN_PRIVATE_KEY> [STRING] is the private key of the origin address, it will be used to sign the transaction.

  * The amount should be provided without multiplying by decimals, use the actual amount as it is.

--

If you wanna contribute to this project, please feel free to fork it and open a PR.
```
