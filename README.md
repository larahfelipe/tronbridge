<p align="center">
  <img src="https://github.com/larahfelipe/tronbridge/blob/master/public/tronicon.png" width="200" height="200" />
</p>

```
TronBridge API Documentation

Available networks:
- Mainnet [mainnet] (https://api.trongrid.io)
- Shasta Testnet [shasta] (https://api.shasta.trongrid.io)

==

Usage example (Mainnet):

Account:
- GET /v1/account/mainnet?address=<ADDRESS>

  Caption:
    1. <ADDRESS> [STRING] is the account address that will be used to retrieve the account information (*).

    * Address parameter supports multiple addresses separated by comma.

- POST /v1/account/mainnet/create?with_mnemonics=<WITH_MNEMONICS>

  Caption:
    1. <WITH_MNEMONICS> [BOOLEAN] is a flag that will be used to include the mnemonics of the account (*).

    * If the with mnemonics parameter is not provided, it will default to `false`.

- POST /v1/account/mainnet/recover
  body: {
    "mnemonics": <MNEMONICS>
  }

  Caption:
    1. <MNEMONICS> [ARRAY] is the mnemonics that will be used to recover the account (*)

    * Mnemonics parameter must have at least 12 words and at most 24 words.

--

Token:
- GET /v1/token/mainnet?id=<TOKEN_ID>&include_abi=<INCLUDE_ABI>&include_bytecode=<INCLUDE_BYTECODE>

  Caption:
    1. <TOKEN_ID> [STRING] is the token id (address) that will be used to retrieve the token information (*);
    2. <INCLUDE_ABI> [BOOLEAN] is a flag that will be used to include the ABI in the response (**);
    3. <INCLUDE_BYTECODE> [BOOLEAN] is a flag that will be used to include the bytecode in the response (***).

    * Token id parameter supports multiple token ids separated by comma.
    ** If the abi parameter is not provided, it will default to `false`.
    *** If the bytecode parameter is not provided, it will default to `false`.

--

Transaction:
- GET /v1/transaction/mainnet?id=<TRANSACTION_ID>

  Caption:
    1. <TRANSACTION_ID> [STRING] is the transaction ID that will be used to retrieve the transaction information.

- GET /v1/transaction/mainnet/all?address=<ADDRESS>&limit=<LIMIT>

  Caption:
    1. <ADDRESS> [STRING] is the account address that will be used to filter the transactions;
    2. <LIMIT> [NUMBER] is the maximum number of transactions that will be returned (*).

    * Limit parameter is optional, if it's not provided, it will default to `5`.

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

  Caption:
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

- POST /v1/transaction/mainnet/stake
  body: {
    "amount": <AMOUNT>,
    "address": <ORIGIN_ADDRESS>,
    "contractType": <CONTRACT_TYPE>,
    "resourceType": <RESOURCE_TYPE>,
    "signingKey": <ORIGIN_PRIVATE_KEY>
  }

  Caption:
    1. <AMOUNT> [NUMBER] is the amount of resource that will be staked (*);
    2. <ORIGIN_ADDRESS> [STRING] is the origin address of the transaction;
    3. <CONTRACT_TYPE> [STRING] is the type of contract that will be performed, it can be "FREEZE_CONTRACT" or "UNFREEZE_CONTRACT";
    4. <RESOURCE_TYPE> [STRING] is the type of resource that will be staked, it can be "BANDWIDTH" or "ENERGY";
    5. <ORIGIN_PRIVATE_KEY> [STRING] is the private key of the origin address, it will be used to sign the transaction.

    * The amount should be provided without multiplying by decimals, use the actual amount as it is.

==

If you wanna contribute to this project, please feel free to fork it and open a PR.
```
