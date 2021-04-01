export class AuthenticationError extends Error {
  constructor() {
    super('Failed to authenticate with storage system');
  }
}

export const isAuthenticationError = (error) =>
  error.name === 'InvalidSignatureException' ||
  error.name === 'UnrecognizedClientException' ||
  error.message.startsWith('Missing credentials');

export class InvalidKeyError extends Error {
  constructor() {
    super('Item had invalid key');
  }
}

export const isInvalidKeyError = (error) => {
  if (
    error.name === 'ValidationException' &&
    error.message.startsWith(
      'One or more parameter values were invalid: Missing the key'
    )
  )
    return true;
  if (
    error.name === 'ValidationException' &&
    error.message.startsWith(
      'One or more parameter values were invalid: Type mismatch for key'
    )
  )
    return true;
  return false;
};

export class MissingTableError extends Error {
  constructor(table) {
    super(`Table '${table}' does not exist`);
  }
}

export class TableExistsError extends Error {
  constructor(table) {
    super(`Table '${table}' already exists`);
  }
}
