import DynamoDB from 'aws-sdk/clients/dynamodb';

import createTable from './createTable';
import addItem from './addItem';

class StorageClient {
  constructor({ credentials: { id, secret }, region = 'us-east-1' }) {
    const configuration = {
      accessKeyId: id,
      region,
      secretAccessKey: secret,
    };
    this.client = new DynamoDB(configuration);
    this.documentClient = new DynamoDB.DocumentClient(configuration);
  }

  async createTable(input) {
    const result = await createTable({
      ...input,
      client: this.client,
    });
    return result;
  }

  async addItem(input) {
    const result = await addItem({
      ...input,
      client: this.documentClient,
    });
    return result;
  }
}

export default StorageClient;
