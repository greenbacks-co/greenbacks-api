import 'babel-polyfill';

import { v4 as uuid } from 'uuid';

import StorageClient from 'storage/client';
import {
  createTable,
  DELAYS,
  getDocumentClient,
  getCredentials,
} from '../../utils';

const TABLE_PREFIX = 'test-add-items-multiple-items';

const getConstructorInput = () => ({
  credentials: getCredentials(),
});

const getInput = (table) => ({
  items: [],
  table,
});

const getName = () => `${TABLE_PREFIX}-${uuid()}`;

const createTableWithSortKey = async (name) => {
  const key = [
    {
      AttributeName: 'partition',
      KeyType: 'HASH',
    },
    {
      AttributeName: 'sort',
      KeyType: 'RANGE',
    },
  ];
  const attributes = [
    {
      AttributeName: 'partition',
      AttributeType: 'N',
    },
    {
      AttributeName: 'sort',
      AttributeType: 'N',
    },
  ];
  await createTable(name, key, attributes);
};

const getItems = async ({ table, partition }) => {
  const client = getDocumentClient();
  const params = {
    ExpressionAttributeNames: { '#partitionName': 'partition' },
    ExpressionAttributeValues: { ':partitionValue': partition },
    KeyConditionExpression: '#partitionName = :partitionValue',
    TableName: table,
  };
  return new Promise((resolve, reject) => {
    client.query(params, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result.Items);
    });
  });
};

test(
  'test with one item successfully adds one item',
  async () => {
    const name = getName();
    await createTableWithSortKey(name);
    const constructorInput = getConstructorInput();
    const input = getInput(name);
    input.items.push({ partition: 1, sort: 1 });
    const client = new StorageClient(constructorInput);
    await client.addItems(input);
    const items = await getItems({ table: name, partition: 1 });
    expect(items).toStrictEqual([{ partition: 1, sort: 1 }]);
  },
  DELAYS.longTest
);

test(
  'test with two items successfully adds two items',
  async () => {
    const name = getName();
    await createTableWithSortKey(name);
    const constructorInput = getConstructorInput();
    const input = getInput(name);
    input.items.push({ partition: 1, sort: 1 }, { partition: 1, sort: 2 });
    const client = new StorageClient(constructorInput);
    await client.addItems(input);
    const items = await getItems({ table: name, partition: 1 });
    expect(items).toStrictEqual([
      { partition: 1, sort: 1 },
      { partition: 1, sort: 2 },
    ]);
  },
  DELAYS.longTest
);
