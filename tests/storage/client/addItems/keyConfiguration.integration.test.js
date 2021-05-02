import 'babel-polyfill';

import { v4 as uuid } from 'uuid';

import settings from 'settings';
import StorageClient, { InvalidKeyError } from 'storage/client';
import {
  createTable,
  DELAYS,
  deleteTablesAfterDelay,
  getCredentials,
  getItem,
} from '../../utils';

const TABLE_PREFIX = 'test-add-items-invalid-keys';

const getInput = (name) => ({
  credentials: {
    id: settings.STORAGE_ID,
    secret: settings.STORAGE_SECRET,
  },
  items: undefined,
  table: name,
});

const createTableWithSortKey = async (name) => {
  const key = [
    {
      AttributeName: 'id',
      KeyType: 'HASH',
    },
    {
      AttributeName: 'date',
      KeyType: 'RANGE',
    },
  ];
  const attributes = [
    {
      AttributeName: 'id',
      AttributeType: 'N',
    },
    {
      AttributeName: 'date',
      AttributeType: 'S',
    },
  ];
  await createTable(name, key, attributes);
};

afterAll(async () => {
  await deleteTablesAfterDelay(TABLE_PREFIX);
}, DELAYS.deleteTables);

test(
  'add items without partition key throws invalid key error',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    await createTable(name);
    const input = getInput(name);
    input.items = [{ notId: '1' }];
    const credentials = getCredentials();
    const client = new StorageClient({ credentials });
    await expect(async () => {
      await client.addItems(input);
    }).rejects.toThrow(InvalidKeyError);
  },
  DELAYS.longTest
);

test(
  'add items with incorrect partition key type throws invalid key error',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    await createTable(name);
    const input = getInput(name);
    input.items = [{ id: '1' }];
    const credentials = getCredentials();
    const client = new StorageClient({ credentials });
    await expect(async () => {
      await client.addItems(input);
    }).rejects.toThrow(InvalidKeyError);
  },
  DELAYS.longTest
);

test(
  'add items with correct partition key type is successful',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    await createTable(name);
    const input = getInput(name);
    input.items = [{ id: 2 }];
    const credentials = getCredentials();
    const client = new StorageClient({ credentials });
    await client.addItems(input);
    const item = await getItem(name, 2);
    expect(item).toStrictEqual({ id: 2 });
  },
  DELAYS.longTest
);

test(
  'add items without sort key throws invalid key error',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    await createTableWithSortKey(name);
    const input = getInput(name);
    input.items = [{ id: 1 }];
    const credentials = getCredentials();
    const client = new StorageClient({ credentials });
    await expect(async () => {
      await client.addItems(input);
    }).rejects.toThrow(InvalidKeyError);
  },
  DELAYS.longTest
);

test(
  'add items with incorrect sort key type throws invalid key error',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    await createTableWithSortKey(name);
    const input = getInput(name);
    input.items = [{ id: 1, date: 5 }];
    const credentials = getCredentials();
    const client = new StorageClient({ credentials });
    await expect(async () => {
      await client.addItems(input);
    }).rejects.toThrow(InvalidKeyError);
  },
  DELAYS.longTest
);

test(
  'add items with correct partition and sort key types is successful',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    await createTable(name);
    const input = getInput(name);
    input.items = [{ id: 3, date: 'test' }];
    const credentials = getCredentials();
    const client = new StorageClient({ credentials });
    await client.addItems(input);
    const item = await getItem(name, 3);
    expect(item).toStrictEqual({ id: 3, date: 'test' });
  },
  DELAYS.longTest
);
