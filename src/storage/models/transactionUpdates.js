import { InputError } from 'errors';
import { MissingTableError } from 'storage/client/errors';
import DateTime from 'utils/datetime';
import logger from 'utils/logger';

class TransactionUpdates {
  constructor(input) {
    validateConstructorInput(input);
    const { environment, storageClient, user } = input;
    this.storageClient = storageClient;
    this.table = `${environment}-transaction-updates`;
    this.user = user;
  }

  async create(input) {
    validateCreateInput(input);
    const { connections } = input;
    const now = DateTime.now().toString();
    const clientInput = {
      item: {
        connections,
        createdDate: now,
        error: null,
        finishedDate: null,
        modifiedDate: now,
        user: this.user,
      },
      key: {
        partition: {
          name: 'user',
          type: 'string',
        },
        sort: {
          name: 'createdDate',
          type: 'string',
        },
      },
      table: this.table,
    };
    await this.storageClient.addItemAndCreateTable(clientInput);
    logger.info('started transaction update');
  }

  async getLatest() {
    const clientInput = {
      key: { partition: { user: this.user } },
      limit: 1,
      shouldReverse: true,
      table: this.table,
    };
    try {
      const updates = await this.storageClient.listItems(clientInput);
      return updates[0];
    } catch (error) {
      if (error instanceof MissingTableError) return null;
      throw error;
    }
  }
}

const validateConstructorInput = ({ environment, storageClient, user }) => {
  if (!environment) throw new InputError('environment');
  if (!storageClient) throw new InputError('storageClient');
  if (!user) throw new InputError('user');
};

const validateCreateInput = ({ connections }) => {
  if (!connections) throw new InputError('connections');
};

export default TransactionUpdates;
