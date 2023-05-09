export const Networks = {
  MAINNET: 'mainnet',
  TESTNET: 'testnet'
} as const;

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
  BUILD_EXCEPTION: 'Something went wrong while building the transaction',
  SIGN_EXCEPTION: 'Something went wrong while signing the transaction',
  BROADCAST_EXCEPTION:
    'Something went wrong while broadcasting the transaction',
  CREATED: 'Transaction created and broadcasted successfully'
};
