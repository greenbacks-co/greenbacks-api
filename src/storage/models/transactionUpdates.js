import { InputError } from 'errors';
import DateTime from 'utils/datetime';

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
