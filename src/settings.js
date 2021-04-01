import 'dotenv/config';

export default {
  AUDIENCE: process.env.AUDIENCE,
  ENVIRONMENT: process.env.ENVIRONMENT || 'dev',
  JWKS_URI: process.env.JWKS_URI,
  STORAGE_ID: process.env.STORAGE_ID,
  STORAGE_SECRET: process.env.STORAGE_SECRET,
  TOKEN_ISSUER: process.env.TOKEN_ISSUER,
  TRANSACTION_ENVIRONMENT: process.env.TRANSACTION_ENVIRONMENT,
  TRANSACTION_ID: process.env.TRANSACTION_ID,
  TRANSACTION_SECRET: process.env.TRANSACTION_SECRET,
};
