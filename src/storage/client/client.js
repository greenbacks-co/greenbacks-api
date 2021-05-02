import DynamoDB from 'aws-sdk/clients/dynamodb';

import { InputError } from 'errors';
import addItems from './addItems';
import createTable from './createTable';
import { MissingTableError } from './errors';
import listItems from './listItems';

class StorageClient {
  constructor({ client, credentials: { id, secret }, region = 'us-east-1' }) {
    const configuration = {
      accessKeyId: id,
      region,
      secretAccessKey: secret,
    };
    if (client) {
      this.client = client;
      this.documentClient = client;
    } else {
      this.client = new DynamoDB(configuration);
      this.documentClient = new DynamoDB.DocumentClient(configuration);
    }
  }

  async addItems(input) {
    const result = await addItems({
      ...input,
      client: this.documentClient,
    });
    return result;
  }

  async addItemsAndCreateTable(input) {
    validateAddItemsAndCreateTableInput(input);
    const { items, key, table } = input;
    try {
      return await this.addItems({
        items,
        table,
      });
    } catch (error) {
      if (!(error instanceof MissingTableError)) throw error;
      await this.createTable({
        key,
        name: table,
      });
      return this.addItems({
        items,
        table,
      });
    }
  }

  async createTable(input) {
    const result = await createTable({
      ...input,
      client: this.client,
    });
    return result;
  }

  async listItems(input) {
    const result = await listItems({
      ...input,
      client: this.documentClient,
    });
    return result;
  }
}

const validateAddItemsAndCreateTableInput = ({ items, key, table }) => {
  if (!items) throw new InputError('items');
  if (!key) throw new InputError('key');
  if (!table) throw new InputError('table');
};

export default StorageClient;
