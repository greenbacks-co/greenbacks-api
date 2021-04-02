import DynamoDB from 'aws-sdk/clients/dynamodb';

import settings from 'settings';

const getClient = () =>
  new DynamoDB({
    accessKeyId: settings.STORAGE_ID,
    region: 'us-east-1',
    secretAccessKey: settings.STORAGE_SECRET,
  });

export const getCredentials = () => ({
  id: settings.STORAGE_ID,
  secret: settings.STORAGE_SECRET,
});

const getDocumentClient = () =>
  new DynamoDB.DocumentClient({
    accessKeyId: settings.STORAGE_ID,
    region: 'us-east-1',
    secretAccessKey: settings.STORAGE_SECRET,
  });

export const createItem = async (table, item) => {
  const client = getDocumentClient();
  return new Promise((resolve, reject) => {
    client.put({ Item: item, TableName: table }, (error) => {
      if (error) reject(error);
      resolve();
    });
  });
};

export const createTable = async (
  name,
  key = [{ AttributeName: 'id', KeyType: 'HASH' }],
  attributes = [{ AttributeName: 'id', AttributeType: 'N' }]
) => {
  const client = getClient();
  const input = {
    AttributeDefinitions: attributes,
    BillingMode: 'PAY_PER_REQUEST',
    KeySchema: key,
    TableName: name,
  };
  return new Promise((resolve, reject) => {
    client.createTable(input, async (error) => {
      if (error) reject(error);
      await delay(DELAYS.createTable);
      resolve();
    });
  });
};

export const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

export const DELAYS = {
  beforeDeleteTables: 5000,
  createTable: 10000,
  deleteTables: 60000,
  longTest: 30000,
};

export const deleteTable = async (table) => {
  const client = getClient();
  const input = {
    TableName: table,
  };
  return new Promise((resolve, reject) => {
    client.deleteTable(input, (error) => {
      if (error) reject(error);
      resolve();
    });
  });
};

export const deleteTablesAfterDelay = async (prefix) => {
  const tables = await listTables(prefix);
  if (tables.length === 0) return;
  await delay(10000);
  const promises = tables.map(deleteTable);
  await Promise.all(promises);
};

export const describeTable = async (table) => {
  const client = getClient();
  const input = {
    TableName: table,
  };
  return new Promise((resolve, reject) => {
    client.describeTable(input, (error, data) => {
      if (error) reject(error);
      resolve(data);
    });
  });
};

export const getItem = (table, id, date = undefined, customKey) => {
  const client = getDocumentClient();
  return new Promise((resolve, reject) => {
    let key = { id };
    if (date) key.date = date;
    if (customKey) key = customKey;
    client.get(
      {
        Key: key,
        TableName: table,
      },
      (error, item) => {
        if (error) reject(error);
        resolve(item.Item);
      }
    );
  });
};

export const listTables = async (prefix) => {
  const client = getClient();
  return new Promise((resolve, reject) => {
    client.listTables({}, (error, data) => {
      if (error) reject(error);
      let tables = data.TableNames;
      if (prefix) tables = tables.filter((table) => table.startsWith(prefix));
      resolve(tables);
    });
  });
};
