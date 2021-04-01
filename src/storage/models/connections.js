import { InputError } from 'errors';
import { MissingTableError } from 'storage/client';

class Connections {
  constructor(input) {
    validateConstructorInput(input);
    const { environment, storageClient } = input;
    this.environment = environment;
    this.storageClient = storageClient;
  }

  async create(input) {
    validateCreateInput(input);
    const { id, name, token, user } = input;
    const table = `${this.environment}-connections`;
    const now = new Date().toISOString();
    const addItemInput = {
      item: {
        createdDate: now,
        id,
        modifiedDate: now,
        name,
        token,
        user,
      },
      table,
    };
    try {
      await this.storageClient.addItem(addItemInput);
    } catch (error) {
      if (error instanceof MissingTableError) {
        await this.storageClient.createTable({
          key: {
            partition: {
              name: 'user',
              type: 'string',
            },
            sort: {
              name: 'token',
              type: 'string',
            },
          },
          name: table,
        });
        await this.storageClient.addItem(addItemInput);
      } else throw error;
    }
  }
}

const validateConstructorInput = ({ environment, storageClient }) => {
  if (!environment) throw new InputError('environment');
  if (!storageClient) throw new InputError('storageClient');
};

const validateCreateInput = ({ id, name, token, user }) => {
  if (!id) throw new InputError('id');
  if (!name) throw new InputError('name');
  if (!token) throw new InputError('token');
  if (!user) throw new InputError('user');
};

export default Connections;
