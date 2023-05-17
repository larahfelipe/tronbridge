export const Networks = {
  MAINNET: 'mainnet',
  TESTNET: 'testnet'
} as const;

export const ContractTypes = {
  TRANSFER: 'transfer_contract',
  FREEZE: 'freeze_contract'
} as const;

export const ResourceTypes = {
  BANDWIDTH: 'bandwidth',
  ENERGY: 'energy'
} as const;

export const TRX_DECIMALS = 6 as const;

export const DefaultErrorMessages = {
  BAD_REQUEST: 'Invalid or corrupted request',
  NOT_FOUND: 'Resource not found',
  INTERNAL_SERVER_ERROR: 'Something went wrong. Try again later',
  UNCAUGHT_EXCEPTION: 'Uncaught runtime exception'
};

export const AccountMessages = {
  CREATED: 'Account created successfully',
  CREATION_EXCEPTION:
    'Something went wrong while generating a new account. Try again later'
};

export const TransactionMessages = {
  NOT_FOUND: 'Transaction not found in the blockchain',
  BUILD_EXCEPTION: 'Something went wrong while building the transaction',
  SIGN_EXCEPTION: 'Something went wrong while signing the transaction',
  BROADCAST_EXCEPTION:
    'Something went wrong while broadcasting the transaction',
  CREATED: 'Transaction created and broadcasted successfully'
};
