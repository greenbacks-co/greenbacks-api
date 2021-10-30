import 'babel-polyfill';

import { v4 as uuid } from 'uuid';

import StorageClient, {
  AuthenticationError,
  MissingTableError,
} from 'storage/client';
import {
  createItem,
  createTable,
  DELAYS,
  deleteTablesAfterDelay,
  getCredentials,
} from '../utils';

const TABLE_PREFIX = 'test-storage-client-list-items';

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

const getInput = (table, partition) => ({
  key: {
    partition,
  },
  shouldReverse: false,
  table,
});

afterAll(async () => {
  await deleteTablesAfterDelay(TABLE_PREFIX);
}, DELAYS.deleteTables);

test('list items with bad id in credentials throws authentication error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  credentials.id = 'bad';
  const client = new StorageClient({ credentials });
  const input = getInput(name, { id: 1 });
  await expect(async () => {
    await client.listItems(input);
  }).rejects.toThrow(AuthenticationError);
});

test('list items with bad secret in credentials throws authentication error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  credentials.secret = 'bad';
  const client = new StorageClient({ credentials });
  const input = getInput(name, { id: 1 });
  await expect(async () => {
    await client.listItems(input);
  }).rejects.toThrow(AuthenticationError);
});

test('list items with missing table throws missing table error', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const client = new StorageClient({ credentials });
  const input = getInput(name, { id: 1 });
  await expect(async () => {
    await client.listItems(input);
  }).rejects.toThrow(MissingTableError);
});

test(
  'list items with partition key ignores items with different partition key',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    const credentials = getCredentials();
    const client = new StorageClient({ credentials });
    const input = getInput(name, { id: 2 });
    await createTable(name);
    await createItem(name, { id: 1, test: 'test' });
    const items = await client.listItems(input);
    expect(items).toStrictEqual([]);
  },
  DELAYS.longTest
);

test(
  'list items with partition key returns items with same partition key',
  async () => {
    const name = `${TABLE_PREFIX}-${uuid()}`;
    const credentials = getCredentials();
    const client = new StorageClient({ credentials });
    const input = getInput(name, { id: 1 });
    await createTable(name);
    await createItem(name, { id: 1, test: 'test' });
    const items = await client.listItems(input);
    expect(items).toStrictEqual([{ id: 1, test: 'test' }]);
  },
  DELAYS.longTest
);

test('list items written in ascending order with should reverse false returns items in ascending order', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const client = new StorageClient({ credentials });
  const input = getInput(name, { id: 1 });
  await createTableWithSortKey(name);
  await createItem(name, { id: 1, date: '2020-01-01' });
  await createItem(name, { id: 1, date: '2020-01-02' });
  const items = await client.listItems(input);
  expect(items).toStrictEqual([
    { id: 1, date: '2020-01-01' },
    { id: 1, date: '2020-01-02' },
  ]);
});

test('list items written in ascending order with should reverse true returns items in descending order', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const client = new StorageClient({ credentials });
  const input = getInput(name, { id: 1 });
  input.shouldReverse = true;
  await createTableWithSortKey(name);
  await createItem(name, { id: 1, date: '2020-01-01' });
  await createItem(name, { id: 1, date: '2020-01-02' });
  const items = await client.listItems(input);
  expect(items).toStrictEqual([
    { id: 1, date: '2020-01-02' },
    { id: 1, date: '2020-01-01' },
  ]);
});

test('list items written in ascending order without should reverse returns items in ascending order', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const client = new StorageClient({ credentials });
  const input = getInput(name, { id: 1 });
  delete input.shouldReverse;
  await createTableWithSortKey(name);
  await createItem(name, { id: 1, date: '2020-01-01' });
  await createItem(name, { id: 1, date: '2020-01-02' });
  const items = await client.listItems(input);
  expect(items).toStrictEqual([
    { id: 1, date: '2020-01-01' },
    { id: 1, date: '2020-01-02' },
  ]);
});

test('list items written in descending order with should reverse false returns items in ascending order', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const client = new StorageClient({ credentials });
  const input = getInput(name, { id: 1 });
  await createTableWithSortKey(name);
  await createItem(name, { id: 1, date: '2020-01-02' });
  await createItem(name, { id: 1, date: '2020-01-01' });
  const items = await client.listItems(input);
  expect(items).toStrictEqual([
    { id: 1, date: '2020-01-01' },
    { id: 1, date: '2020-01-02' },
  ]);
});

test('list items written in descending order with should reverse true items in descending order', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const client = new StorageClient({ credentials });
  const input = getInput(name, { id: 1 });
  input.shouldReverse = true;
  await createTableWithSortKey(name);
  await createItem(name, { id: 1, date: '2020-01-02' });
  await createItem(name, { id: 1, date: '2020-01-01' });
  const items = await client.listItems(input);
  expect(items).toStrictEqual([
    { id: 1, date: '2020-01-02' },
    { id: 1, date: '2020-01-01' },
  ]);
});

test('list items written in descending order wihout should reverse returns items in ascending order', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const client = new StorageClient({ credentials });
  const input = getInput(name, { id: 1 });
  delete input.shouldReverse;
  await createTableWithSortKey(name);
  await createItem(name, { id: 1, date: '2020-01-02' });
  await createItem(name, { id: 1, date: '2020-01-01' });
  const items = await client.listItems(input);
  expect(items).toStrictEqual([
    { id: 1, date: '2020-01-01' },
    { id: 1, date: '2020-01-02' },
  ]);
});

test('list two items with limit 1 returns one item', async () => {
  const name = `${TABLE_PREFIX}-${uuid()}`;
  const credentials = getCredentials();
  const client = new StorageClient({ credentials });
  const input = getInput(name, { id: 1 });
  input.limit = 1;
  await createTableWithSortKey(name);
  await createItem(name, { id: 1, date: '2020-01-01' });
  await createItem(name, { id: 1, date: '2020-01-02' });
  const items = await client.listItems(input);
  expect(items).toStrictEqual([{ id: 1, date: '2020-01-01' }]);
});
