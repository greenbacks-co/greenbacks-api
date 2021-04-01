import buildServer from 'api';
import { decodeToken } from 'authorizer';
import StorageClient from 'storage/client';
import FinanceClient from 'finance';
import settings from 'settings';

// test 2

const buildFinanceClient = () => {
  try {
    return new FinanceClient({
      env: settings.TRANSACTION_ENVIRONMENT,
      id: settings.TRANSACTION_ID,
      secret: settings.TRANSACTION_SECRET,
    });
  } catch (error) {
    const message = `Failed to initialize finance client: ${error.message}`;
    console.error(message);
    throw new Error(message);
  }
};

const buildStorageClient = () => {
  try {
    return new StorageClient({
      credentials: {
        id: settings.STORAGE_ID,
        secret: settings.STORAGE_SECRET,
      },
    });
  } catch (error) {
    const message = `Failed to initialize storage client: ${error.message}`;
    console.error(message);
    throw new Error(message);
  }
};

const config = {
  buildClients: () => ({
    financeClient: buildFinanceClient(),
    storageClient: buildStorageClient(),
  }),
  environment: settings.ENVIRONMENT,
  parseUser: ({ token }) => {
    const splitToken = token.split(' ');
    const decodedToken = decodeToken(splitToken[1]);
    const user = decodedToken.payload.sub;
    if (!user) throw new Error('Failed to decode token');
    return user;
  },
};

const server = buildServer(config);

const handler = server.createHandler();

export default handler;
