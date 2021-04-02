import DynamoDB from 'aws-sdk/clients/dynamodb';

import addItem from './addItem';
import createTable from './createTable';
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

export default StorageClient;
