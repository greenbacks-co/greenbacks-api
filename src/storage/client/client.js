import DynamoDB from 'aws-sdk/clients/dynamodb';

import { InputError } from 'errors';
import addItem from './addItem';
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

  async addItem(input) {
    const result = await addItem({
      ...input,
      client: this.documentClient,
    });
    return result;
  }

  async addItemAndCreateTable(input) {
    validateAddItemAndCreateTableInput(input);
    let { addItem, createTable } = input;
    const { item, key, table } = input;
    try {
      return await this.addItem({
        item,
        table,
      });
    } catch (error) {
      if (!(error instanceof MissingTableError)) throw error;
      await this.createTable({
        key,
        name: table,
      });
      await this.addItem({
        item,
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

const validateAddItemAndCreateTableInput = ({ item, key, table }) => {
  if (!item) throw new InputError('item');
  if (!key) throw new InputError('key');
  if (!table) throw new InputError('table');
};

export default StorageClient;
